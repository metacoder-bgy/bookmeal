#!/usr/bin/env ruby
# -*- ruby -*-

require 'cgi'
require 'json'

require_relative 'dbaccess'
require_relative 'exceptions'
require_relative 'bookmeal'


puts 'Content-Type: application/json'
puts 'Access-Control-Allow-Origin: *'
puts ''


begin

cgi = CGI.new

forum_uid = cgi['forum_uid'] || raise_client_error
action = cgi['action'] || raise_client_error


init_db
load_data

rescue ClientError
  puts JSON.dump({ :status => :error, :error_message => :client_error})
  exit
rescue Exception
  puts JSON.dump({ :status => :error,
                   :error_message => :server_error,
                   :server_error_name => $!.class.to_s,
                   :server_error_message => $!.message
                 })
  exit
end

def do_action(cgi, action, forum_uid)
  case action
  when 'addcard'
    card_no = cgi['card_no'] || raise_client_error
    card_passwd = cgi['card_passwd'] || raise_client_error
    begin
      find_user(forum_uid)
    rescue NoSuchForumUID
      add_user(forum_uid)
    end

    add_card(forum_uid, card_no, card_passwd)
    store_data
    return true
    # add card


  when 'rmcard'
    card_no = cgi['card_no'] || raise_client_error


    rm_card(forum_uid, card_no)
    store_data
    return true
    # rm card
  when 'chcard'
    card_no = cgi['card_no'] || raise_client_error
    new_passwd = cgi['new_card_password'] || raise_client_error

    change_card_password(forum_uid, card_no, new_passwd)
    store_data
    return true

  when 'lscard'
    begin
      return {
        :card_list => get_cards(forum_uid).map(&:first)
      }
    rescue NoSuchForumUID
      return {
        :card_list => []
      }
    end

  when 'savecard'
    begin
      clear_cards(forum_uid)
    rescue NoSuchForumUID
      add_user(forum_uid)
    end

    card_count = cgi['card_count'] || raise_client_error
    1.upto(card_count.to_i) do |x|
      card_no = cgi["card#{x}_no"] || raise_client_error
      card_passwd = cgi["card#{x}_psw"] || raise_client_error

      add_card(forum_uid, card_no, card_passwd)
#      change_or_create_card_password(forum_uid, card_no, card_passwd)
    end

    store_data

    return true

  when 'bookmeal_bydb'
    card_no = cgi['card_no'] || raise_client_error
    card_passwd = get_card_password(forum_uid, card_no)

    return bookmeal(card_no, card_passwd)

  when 'bookmeal_bytmp'
    card_no = cgi['card_no']
    card_passwd = cgi['card_psw']

    return bookmeal(card_no, card_passwd)
  else
    raise_client_error
  end
end



class String
  def underscore
    self.gsub(/::/, '/').
      gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2').
      gsub(/([a-z\d])([A-Z])/,'\1_\2').
      tr("-", "_").
      downcase
  end
end

result = nil
begin
  result = do_action(cgi, action, forum_uid)
rescue Exception
  result = $!
end

json_hsh = {}

case result
when true
  json_hsh = { :status => 'ok' }
when Hash
  json_hsh = result.merge :status => 'ok'
when WrongCardPassword
  json_hsh = {
    :status => 'error',
    :error_message => 'wrong_card_password'
  }
when Exception
  json_hsh = {
    :status => 'error',
    :error_message => :server_error,
    :server_error_type => result.class.to_s.underscore,
    :server_error_message => result.message,
    :server_error_backtrace => result.backtrace
  }
else
  json_hsh.merge!(:status => 'unknown',
                  :type => result.class.to_s,
                  :dump => result.inspect)
end


puts JSON.dump(json_hsh)

#puts cgi['jsonp'] + '(' + JSON.dump(json_hsh) + ');'



