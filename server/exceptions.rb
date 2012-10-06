

class NoSuchForumUID < Exception; end
class WrongCardPassword < Exception; end
class NoSuchCard < Exception; end
class CardAlreadyExist < Exception; end
class ServerError < Exception; end
class ClientError < Exception; end


def raise_client_error
  raise ClientError
end

