const { CTFdClient } = require('../dist/index.js');

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

    const chall = challs.find((c) => c.name === 'The Lost Park');
    const res = await client.submitFlag(chall.id, 'cftd{test_flag}');
    console.log(res);
})()
