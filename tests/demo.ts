import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const challs = await client.getChallenges();
    console.log(challs);

    const scoreboard = await client.getScoreboard();
    console.log(scoreboard.slice(0, 5));

    const chall = challs.find((c) => c.name === 'The Lost Park')!;
    const res = await client.submitFlag(chall.id, 'Major Mark Park');
    console.log(res);
})()
