import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const challs = await client.challenges.get();
    console.log(challs);

    const scoreboard = await client.scoreboard.get();
    console.log(scoreboard.slice(0, 5));

    const chall = challs.find((c) => c.name === 'The Lost Park')!;
    const details = await client.challenges.getDetails(chall.id);
    console.log(details);

    const res = await client.challenges.submitFlag(chall.id, 'Major Mark Park');
    console.log(res);

    const solves = await client.challenges.getSolves(chall.id);
    console.log(solves);

    const user = await client.users.me.get();
    console.log(user);

    // This should be equivalent to the above
    console.log(await client.users.getById(user.id));
})()
