from setuptools import setup

setup(
	name='hackupcapi',
	version='0.1',
	description='HackUPC API v1',
	url='https://github.com/hackupc/hackupc-2016-API',
	author='hackupc',
	install_requires=[
		'sqlalchemy',
		'flask',
        'flask-sqlalchemy',
        'alembic'
	]
)