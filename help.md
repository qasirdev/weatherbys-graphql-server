### installation
npm i
docker-compose up
npx prisma generate
npx prisma migrate dev
npx prisma db push
npm run seed
npm run dev

### To open prisma studio
npx studio prisma

npm i cookie-parser express-session passport
npm i @types/cookie-parser @types/express-session @types/passport
npm i body-parser bcryptjs @types/bcryptjs

### To check node version with node version manager:
node -v
nvm list
nvm ls-remote
nvm install 20.11.0
nvm use 14.5.0

<!-- 
### Blog:
https://jkettmann.com/authentication-and-authorization-with-graphql-and-passport
https://github.com/ericmakesapps/graphql-passport/blob/main/src/buildContext.ts

### Template:
https://www.youtube.com/watch?v=jYYjIWXG1_A
https://github.com/michaelDonchenko/graphql-server-template/blob/master/src/graphql/resolvers/user.resolver.ts
-->
