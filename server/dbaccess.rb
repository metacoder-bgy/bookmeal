# -*- coding: utf-8 -*-

require_relative 'exceptions.rb'

DB_FILE = '/var/db/bmdb/db.bin'
#DB_FILE = '/home/dp3/tmp/tmp.db'


@data = []

def init_db(force = false)
  if File.exists?(DB_FILE)
    return unless force
  end

  File.write(DB_FILE, Marshal.dump(@data))
end

def load_data
  content = File.read(DB_FILE)
  unless content.empty?
    @data = Marshal.load(content)
  end
end

def store_data
  File.write(DB_FILE, Marshal.dump(@data))
end

# Interfaces
def add_user(forum_uid)
  @data << {
    :forum_uid => forum_uid,
    :cards => []
  }
end

def find_user(forum_uid)
  @data.detect {|x| x[:forum_uid] == forum_uid} or
    raise NoSuchForumUID
end

def travel_cards(forum_uid, &operation)
  find_user(forum_uid)[:cards].each(&operation)
end

def get_cards(forum_uid)
  find_user(forum_uid)[:cards].dup
end

def add_card(forum_uid, card_no, card_password)
  get_cards(forum_uid).find {|x,_| x == card_no } and raise CardAlreadyExist
  find_user(forum_uid)[:cards] << [card_no, card_password]
end

def rm_card(forum_uid, card_no)
  find_user(forum_uid).delete_if {|x,_| x == card_no} or
    raise NoSuchCard
end

def clear_cards(forum_uid)
  find_user(forum_uid)[:cards].clear
end

def get_card_password(forum_uid, card_no)
  tmp = find_user(forum_uid)[:cards].select {|x,_| x == card_no } or
    raise NoSuchCard
  return tmp.last.last
end

def change_card_password(forum_uid, card_no, new_card_password)
  rm_card(forum_uid, card_no) and
    add_card(forum_uid, card_no, new_card_password)
end

def change_or_create_card_password(forum_uid, card_no, new_passwd)
  begin find_user(forum_uid)
  rescue NoSuchForumUID; add_user(forum_uid)
  end

  begin rm_card(forum_uid, card_no)
  rescue NoSuchCard; nil
  end

  add_card(forum_uid, card_no, new_passwd)
end


def raw_db
  @data
end




