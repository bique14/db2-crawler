# Science Direct crawler

## Requiements
- node.js
- npm or yarn
- python 3
- mongo

## Run Crawler
1. Run mongoDB
```
mongod --dbpath "PATH_TO_SAVE_DB"
```
2. Run craw.py
```python3
python3 craw.py <keyword>
```
___

## Run Website
1. Run mongoDB
```
mongod --dbpath "PATH_TO_SAVE_DB"
```
2. Run server
```
cd server/
npm i (or) yarn 
npm start (or) yarn start
```
3. Run website
```
cd db2-web
npm i (or) yarn 
npm start (or) yarn start
```
___

## Restore data from dump folder
```
mongostore dump/
```


## Authors
- [Thanakorn Peetivorapat](https://github.com/Tanakornl3oom) 5809610396
- [Nattanon Yanil](https://github.com/eieizahahayo) 5809680019
- [Peerasorn Hemsart](https://github.com/bique14) 5809680035