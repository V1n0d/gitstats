from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    GitData,
    )

import urllib2
import json

@view_config(route_name='home', renderer='templates/index.pt')
def index(request):
  stats=get_all_statistics()  
  return dict(stats_history=stats)

def get_all_statistics():
  object = DBSession.query(GitData)
  return object

@view_config(route_name='stats', renderer='json')
def stats(request):
  username = request.params.get('username')
  repository = request.params.get('repository')
  stats = get_statistics_data(username,repository)
  if len(stats)>0:
    insert_statistics(username,repository)
  return dict(stats=stats)

def get_statistics_data(username,repository):
  url = 'https://api.github.com/repos/'+username+'/'+repository+'/stats/punch_card'
  response = urllib2.urlopen(url)
  commit_activities = json.loads(response.read())
  stats = []
  for index,activity in enumerate(commit_activities):
    if activity[2]:
      stats.append({
          'day':activity[0],
          'time':activity[1], 
          'commits':activity[2]
      })
  return stats

def insert_statistics(username,repository):
  object = DBSession.query(GitData).filter_by(username=username).filter_by(repository=repository).first()
  if object is None:
    object = DBSession.add(GitData(username=username, repository=repository))
  return object
  

