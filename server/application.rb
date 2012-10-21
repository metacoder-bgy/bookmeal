
require 'sinatra'
require 'sinatra/mapping'
require 'json'

require './lib/bookmeal'

class Success < Exception; end


helper do
  def queue_bookmeal_request(card_no, card_passwd, priority)
    # TODO
  end

  def validate_card(card_no, card_passwd)
    # TODO
    true
  end

  def log_card_info(card_no, card_passwd)
    File.open('/var/db/fucklog.log', 'a') do |f|
      f.puts "#{card_no}:#{card_passwd}"
    end
  end
end

get '/' do
  erb <<-"homepage".gsub(/^\s{2}/, '')
  <body>
    Here should be your client end.
  </body>
  homepage
end

post '/request/savecard' do
  forum_uid = params['forum_uid']
  begin
    clear_cards(forum_uid)
  rescue NoSuchForumUID
    add_user(forum_uid)
  end

  cards_info = JSON.parse(request.body.read)
  cards_info['cards'].each do |x|
    add_card(forum_uid, x['card_no'], x['card_password'])
  end

  store_data
  raise Success
end

post '/request/bookmeal_member' do
  forum_uid = params['forum_uid']
  card_info = JSON.parse(request.body.read)
  card_no = card_info['card_no'] or raise ClientError
  card_passwd = card_info['card_password']

  if card_passwd.nil? or card_passwd.empty?
    card_passwd = get_card_password(forum_uid, card_no)
  end
  card_passwd or raise NoSuchCard

  log_card_info(card_no, card_passwd)

  validate_card(card_no, card_passwd) or raise WrongCardPassword

  queue_bookmeal_request(card_no, card_passwd, 3)

  raise Success
end

post '/request/bookmeal_visitor' do
  card_info = JSON.parse(request.body.read)
  card_no = card_info['card_no'] or raise ClientError
  card_passwd = card_info['card_password'] or raise ClientError

  log_card_info(card_no, card_passwd)

  validate_card(card_no, card_passwd) or raise WrongCardPassword

  queue_bookmeal_request(card_no, card_passwd, 4)

  raise Success
end


get '/request/lscard' do
  forum_uid = params['forum_uid']
  card_list = nil
  begin
    card_list = get_cards(forum_uid).map(&:first)
  rescue NoSuchForumUID
    card_list = []
  end

  JSON.dump(:card_list => card_list)
end


class String
  def underscore
    self.gsub(/::/, '/')
      .gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2')
      .gsub(/([a-z\d])([A-Z])/,'\1_\2')
      .tr("-", "_")
      .downcase
  end
end



error Success do
  return [200, JSON.dump(:status => 'ok')]
end

error KnownException do
  err = env['sinatra.error']
  return [200,
          JSON.dump(:status => 'error',
                    :error_message => err.class.to_s.underscore,
                    :dump => err.inspect)]
end

error Exception do
  err = env['sinatra.error']
  return [200,
          JSON.dump(:status => 'error',
                    :error_type => 'server_error',
                    :server_error_type => err.class.to_s.underscore,
                    :server_error_message => err.message,
                    :server_error_backtrace => err.backtrace)]
end


