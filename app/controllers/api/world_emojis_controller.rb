class Api::WorldEmojisController < ApplicationController
  def index
    @world_tweets = TwitterApi.world2
    WorldEmoji.create(emojis: @world_tweets)
  end

  def show
    @world_tweets = WorldEmoji.last.emojis
  end
end
