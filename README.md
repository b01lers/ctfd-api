# CTFd API
A simple, typed client for the CTFd API.

### Installing
```bash
npm i @b01lers/ctfd-api
```

### Motivation
Nominally, CTFd maintains documentation about their API endpoints through their
[API docs site](https://docs.ctfd.io/docs/api/redoc/). However, many response fields and request parameters remain
undocumented.

Furthermore, not every API endpoint is actually accessible through the `AccessToken`-based authorization
documented on the site, and certain endpoints have missing or incorrect data when accessed with an `AccessToken`;
notably,
- The [flag submission endpoint](https://docs.ctfd.io/docs/api/redoc/#tag/challenges/operation/post_challenge_attempt) always returns 403 when requested without an authenticated session cookie.
- The [challenge list endpoint](https://docs.ctfd.io/docs/api/redoc/#tag/challenges/operation/get_challenge_list) doesn't populate the `solved_by_me` field correctly when quested without an authenticated session cookie.

Therefore, the client provided by this library is a "user bot" that uses your credentials to authenticate the way a
regular user would.
```ts
const client = new CTFdClient({
    url: 'https://demo.ctfd.io/',
    username: 'user',
    password: 'password',
});
```
Many of the types used and exported by this library are reverse engineered from CTFd's client requests as well, and may
likely be more comprehensive than what is documented on their official API docs above.

### Usage
<!-- TODO: docs -->
Example usage that fetches challenges from the CTFd demo instance and attempts to submit a flag for a challenge:
```ts
import { CTFdClient } from '@b01lers/ctfd-api';

const client = new CTFdClient({
    url: 'https://demo.ctfd.io/',
    username: 'user',
    password: 'password',
});

// Fetch challenges list
const challs = await client.challenges.get();

// Fetch scoreboard data
const scoreboard = await client.scoreboard.get();
console.log(scoreboard.slice(0, 5));

// Get details about a challenge, and submit a flag
const chall = challs.find((c) => c.name === 'The Lost Park')!;
const details = await client.challenges.getDetails(chall.id);
console.log(details.description);

await client.challenges.submitFlag(chall.id, 'Major Mark Park');

const solves = await client.challenges.getSolves(chall.id);
console.log(solves);

// Fetch information about a user
const user = await client.users.me.get();
const userSolves = await client.users.me.getSolves();
const awards = await client.users.me.getAwards();
console.log(user);

// This should be equivalent to the above
console.log(await client.users.getById(user.id));
console.log(await client.users.getSolves(user.id));
console.log(await client.users.getAwards(user.id));
```
