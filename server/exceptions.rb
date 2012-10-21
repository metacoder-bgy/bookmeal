

class KnownException < Exception; end

class NoSuchForumUID < KnownException; end
class WrongCardPassword < KnownException; end
class NoSuchCard < KnownException; end
class CardAlreadyExist < KnownException; end
class ServerError < KnownException; end
class ClientError < KnownException; end


def raise_client_error
  raise ClientError
end

