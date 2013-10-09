require 'sinatra'
require 'json'

require_relative 'exceptions'
require_relative 'bookmeal'


helpers do
  class String
    def underscore
      self.gsub(/::/, '/')
        .gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2')
        .gsub(/([a-z\d])([A-Z])/,'\1_\2')
        .tr("-", "_")
        .downcase
    end
  end
end

post '/action' do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*'


  card_no = request['card_no']
  card_passwd = request['card_psw']

  if card_no.nil? or card_passwd.nil? or
      card_no.empty? or card_passwd.empty?
    return JSON.dump(:status => :error,
                     :error_type => :client_error)
  end

  result = nil
  begin
    result = do_batch(card_no, card_passwd)
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
      #      :server_error_type => result.class.to_s.underscore,
      :server_error_message => result.message,
      #    :server_error_backtrace => result.backtrace
    }
  else
    json_hsh.merge!(:status => 'unknown',
                    :type => result.class.to_s,
                    :dump => result.inspect)
  end

  JSON.dump(json_hsh)
end
