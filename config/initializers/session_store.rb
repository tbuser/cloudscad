# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_cloudscad_session',
  :secret      => '2cdb297411fc0021116adfcb49b859287615d9e584514b494d0847204a33ad9d3a91bc0c025b67479d415f6482ae185dcc07d6184aa7233e95b4113cbd244131'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
