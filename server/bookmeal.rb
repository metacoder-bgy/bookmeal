
require 'rest-client'
require 'date'

require_relative 'exceptions'

QUERY_COOKIE_URL = 'http://bgy.gd.cn/mis/info/menu_info.asp' \
                   '?type=%D1%A7%C9%FA%CD%F8%D2%B3'
QUERY_LOGIN_URL = 'http://bgy.gd.cn/mis/info/list.asp'
QUERY_BOOKING_URL = 'http://bgy.gd.cn/mis/info/dc_info/dc3_new.asp'

def get_login_token(card_no, password)
  init_cookie = RestClient.get(QUERY_COOKIE_URL).cookies.to_a.first.join('=')

  rst = RestClient.post(QUERY_LOGIN_URL, {
                          :tbarno => card_no.to_s,
                          :passwd => password.to_s,
                          :hd => '001',
                          :B1 => "\xc8\xb7\xb6\xa8"
                        }, :cookie => init_cookie)

  rst.include? "\xCC\xF5\xD0\xCE\xC2\xEB\xB4\xED\xCE\xF3" and return false
  return init_cookie
end

def get_week_list(token)
  RestClient.post(QUERY_BOOKING_URL, {}, :cookie => token).scan(/\d{8}/)
    .sort.uniq.grep(/^20/)[1..-1]
end

def bookmeal(token, weekno)
  candidates = [('1'..'5').to_a, ('b'..'c').to_a]

  fields = []
  candidates[0].each do |a|
    candidates[1].each do |b|
      fields << ["D#{a}#{b}", '11']
      fields << ["D#{a}#{b}j", 'A']
=begin
      fields << ["D#{a}#{b}", '']
      fields << ["D#{a}#{b}j", '']
=end
    end
  end

  result = RestClient.post(QUERY_BOOKING_URL, {
                             :m_date => weekno + '7',
                             :hd => '001',
                             :size => 'A',
                             :B1 => "\xb1\xa3\xb4\xe6",
                           }.merge(fields.map {|a,b| {a=>b} }
                                     .inject({}, &:merge)),
                           :cookie=> token)
  return result
  return true

rescue RestClient::InternalServerError
  raise ServerError

end

def get_cached_week_list(token)
  @week_list_cache ||= get_week_list
end

def do_batch(card_no, passwd)
  token = get_login_token(card_no, passwd)
  raise WrongCardPassword unless token
  get_cached_week_list(token).each do |week|
    bookmeal(token, week)
  end
  true
end


if __FILE__ == $0
  require 'ap' or alias_method :ap, :p
  # ap bookmeal('0105444', '128830')

  File.read('tmp').each_line do |x|
    no, pwd = x.chomp.split ':'
    puts "Booking '#{no}--#{pwd}'"
    tok = get_login_token(no, pwd)
    (puts 'Login failed'; next) unless tok
    get_week_list(tok).each do |x|
      puts "#{x}"
      bookmeal(tok, x)
    end
    puts '--'
  end


end
