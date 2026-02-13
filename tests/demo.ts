import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const challs = await client.challenges.getChallenges();
    console.log(challs);

    const scoreboard = await client.scoreboard.getScoreboard();
    console.log(scoreboard.slice(0, 5));

    const chall = challs.find((c) => c.name === 'The Lost Park')!;
    const details = await client.challenges.getDetails(chall.id);
    console.log(details);

    const res = await client.challenges.submitFlag(chall.id, 'Major Mark Park');
    console.log(res);
})()
