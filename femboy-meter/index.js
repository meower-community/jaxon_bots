import { join, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import pkg from './wrapper.cjs';
const { Bot } = pkg;

const bot = new Bot('femboy-meter', '');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let trade = {
    "sell": 15,
    "get": 20
}
const notes = 'ver0.3.1\na random amount of interest is given to all players every 5 minutes.'
const adapter = new JSONFile(join(__dirname, 'db/db.json'));
const db = new Low(adapter);
const shop = {
    'socks': {
        'price': 100,
        'description': 'A pair of programming socks.',
        'femgain': 10,
        'use-msg': ['You put on your long, striped socks. They feel tight on your lower thighs and feet.', 'You put on your programming socks. Now you feel ready to program in Rust.', 'You accidentally rip your socks while putting them on. (Luckily, you have a buddy who can sew them back up.)', 'The socks are tight on your leg.', 'Incredible, you\'re more of a femboy now than you were 10 minutes ago.', 'You wiggle your toes once you put them on to really get a feel of that cotton. It feels nice.', 'I think # would like to see you wearing this.'],
        'unequip-msg': ['You took off the socks one by one.', 'Finally, fresh air.', 'Those socks were pretty tight...', 'I mean, they were comfy at first.']
    },
    'crop-top': {
        'price': 200,
        'description': 'A crop top, for when you\'re feeling like a femboy.',
        'femgain': 30,
        'use-msg': ['You put on the crop top, which was tight on your chest.', 'You put on the crop top, showing a lot of skin than you usually do.', 'It\'s pretty small, but it\'ll do.', 'I wonder what # would think of you wearing this...', 'The crop top rips at the seams while putting it on, but you\'d rather not fix it.'],
        'unequip-msg': ['It was kinda tight anyways...', 'Too small for my size.', 'I should\'t wear this casually.']
    },
    'food': {
        'price': 50,
        'description': 'A meal from your favorite restaurant!',
        'femgain': -5,
        'use-msg': ['You ate the meal, licking your lips afterward.', 'You were hungry and you ate it. The end.', 'Yummy!', 'Nom nom nom.', 'You know what, this is pretty good.', 'But why did they have human steak on the menu?', 'The snail is getting closer.', 'The food is exquisedtedt, or however you spell it.', 'Those IKEA meatballs were good.'],
        'delete_on_use': true,
    },
    'maid-outfit': {
        'price': 1000,
        'description': 'A maid outfit which quite barely fits.',
        'femgain': 80,
        'use-msg': ['You put on the maid dress, then the garments, and then everything... else.', 'The maid outfit is pretty tight on your femboy thighs.', 'Hey #, check it out!', 'Nya. Or something.', 'You are a femboy maid now.', 'The maid outfit suddenly makes you want to serve some plates at a diner.', 'You know, #, you don\'t have to stare.', 'You\'re pretty good at putting on this maid outfit, have you done it before?'],
        'unequip-msg': ['That was hard to take off.', 'Okay #, now you can look, it\'s off.', 'Not casual wear at all.', 'Why did I wear this again?', 'That felt nice for the first 30 minutes until I got hot.']
    },
    'febreze': {
        'price': 25,
        'description': 'Some febreze to keep your room smelling nice.',
        'femgain': 0,
        'use-msg': ['You sprayed some febreze, it smells nice.', 'The febreze smells wonderful.', 'You sprayed some febreze and then walked into it so that it sticks to you and you smell nice.', 'Great, your room isn\'t a biohazard now.', 'mmm....', 'The snail is getting closer.'],
        'delete_on_use': true,
    }
}

await db.read();
if (!db.data) db.data = { };

bot.on('ready', () => {
    console.log('Bot is ready!');
})

bot.on('error', (err) => {
    console.log(err);
})

bot.on('post', async (message) => {
    console.log(message);
    let parsed = bot.parse(message, 'fem.')
    if (parsed) {
        if (parsed.command == 'meter') {
            if (db.data.hasOwnProperty(message.author)) {
                db.data[message.author].meter += Math.floor(Math.random() * 21) - 10;
                if (db.data[message.author].meter > 100) db.data[message.author].meter = 100;
                if (db.data[message.author].meter < 0) db.data[message.author].meter = 0;
                bot.post(`You are ${db.data[message.author].meter}% a femboy!`, message.origin)
            } else {
                db.data[message.author] = { meter: Math.floor(Math.random() * 101), fembucks: 0, items: [], equipped: [], lasttrade: 0, notify: false, luckynum: Math.floor(Math.random() * 51)}
                bot.post(`You are ${db.data[message.author].meter}% a femboy!`, message.origin)
            }
        } else if (parsed.command == 'find') {
            if (parsed.args[0]) {
                let user = parsed.args[0];
                if (db.data.hasOwnProperty(user)) {
                    bot.post(`${user} is ${db.data[user].meter}% a femboy!`, message.origin)
                } else {
                    bot.post(`${user} is not in the database!`, message.origin)
                }
            }
        } else if (parsed.command == 'info') {
            bot.post(`Hosting ${Object.keys(db.data).length} users with a custom wrapper. // made by jaxonbaxon#7560`, message.origin)
        } else if (parsed.command == 'shop') {
            let assembly = []
            Object.keys(shop).forEach(item => {
                assembly.push(`${item} - ${shop[item].price} fembucks - ${shop[item].description}`)
            })
            if (parsed.args.length > 0) {
                assembly.forEach(item => {
                    if (item.startsWith(parsed.args[0])) {
                        bot.post(item, message.origin)
                    }
                })
            } else {
                bot.post(assembly.join('\n'), message.origin)
            }
        } else if (parsed.command == 'trade') {
            if (!db.data.hasOwnProperty(message.author)) return;
            if (db.data[message.author].lasttrade == 0 || (Math.floor(Date.now() / 1000) - db.data[message.author].lasttrade) >= 60) {
                if (db.data[message.author].meter >= 20) {
                    db.data[message.author].meter -= trade.sell
                    db.data[message.author].fembucks += trade.get
                    db.data[message.author].lasttrade = message.timestamp
                    bot.post(`Traded ${trade.sell} points off your femboy meter for ${trade.get} fembucks!`, message.origin)
                } else {
                    bot.post('You don\'t have enough points on your femboy meter!', message.origin)
                }
            } else {
                bot.post('Wait 1 minute until trading again!', message.origin)
            }
        } else if (parsed.command == 'buy' && db.data.hasOwnProperty(message.author)) {
            if (parsed.args.length > 0) {
                if (shop.hasOwnProperty(parsed.args[0])) {
                    if (db.data[message.author].fembucks >= shop[parsed.args[0]].price) {
                        db.data[message.author].fembucks -= shop[parsed.args[0]].price;
                        db.data[message.author].items.push(parsed.args[0]);
                        bot.post(`You bought ${parsed.args[0]}!`, message.origin)
                    } else {
                        bot.post(`You don't have enough fembucks!`, message.origin)
                    }
                } else {
                    bot.post(`That item doesn't exist!`, message.origin)
                }
            } else {
                bot.post(`You didn't specify an item!`, message.origin)
            }
        } else if (parsed.command == 'fembucks' && db.data.hasOwnProperty(message.author)) {
            bot.post(`You have ${db.data[message.author].fembucks} fembucks!`, message.origin)
        } else if (parsed.command == 'items' && db.data.hasOwnProperty(message.author)) {
            if (db.data[message.author].items.length > 0) {
                bot.post(db.data[message.author].items.join(', '), message.origin)
            } else {
                bot.post(`You don't have any items!`, message.origin)
            }
        } else if (parsed.command == 'equip' && db.data.hasOwnProperty(message.author)) {
            if (parsed.args[0]) {
                if (db.data[message.author].items.includes(parsed.args[0])) {
                    if (!db.data[message.author].equipped.includes(shop[parsed.args[0]])) {
                        if (shop[parsed.args[0]]['delete_on_use']) {
                            db.data[message.author].items.splice(db.data[message.author].items.indexOf(parsed.args[0]), 1)
                        } else {
                            db.data[message.author].equipped.push(parsed.args[0])
                            db.data[message.author].items.splice(db.data[message.author].items.indexOf(parsed.args[0]), 1)
                        }
                        let use = shop[parsed.args[0]]['use-msg'][Math.floor(Math.random() * shop[parsed.args[0]]['use-msg'].length)]
                        db.data[message.author].meter += shop[parsed.args[0]].femgain
                        let ulist = bot.get('ulist')
                        bot.post(use.replace(/#/g, ulist[Math.floor(Math.random() * ulist.length)]), message.origin)
                    } else {
                        bot.post(`You can't equip that!`, message.origin)
                    }
                } else {
                    bot.post(`You don't have that item!`, message.origin)
                }
            }
        } else if (parsed.command == 'unequip' && db.data.hasOwnProperty(message.author)) {
            if (parsed.args[0]) {
                if (db.data[message.author].equipped.includes(parsed.args[0])) {
                    db.data[message.author].equipped.splice(db.data[message.author].equipped.indexOf(parsed.args[0]), 1)
                    db.data[message.author].items.push(parsed.args[0])
                    db.data[message.author].femgain -= (Math.abs(shop[parsed.args[0]]['femgain']) / 2)
                    if (shop[parsed.args[0]].hasOwnProperty('unequip-msg')) {
                        bot.post(shop[parsed.args[0]]['unequip-msg'][Math.floor(Math.random() * shop[parsed.args[0]]['unequip-msg'].length)], message.origin)
                    } else {
                        bot.post(`You unequipped ${parsed.args[0]}.`, message.origin)
                    }
                } else {
                    bot.post(`You don't have that item equipped!`, message.origin)
                }
            }
        } else if (parsed.command == 'equipped' && db.data.hasOwnProperty(message.author)) {
            if (parsed.args[0]) {
                if (db.data[message.author].equipped.includes(parsed.args[0])) {
                    bot.post(`You have ${parsed.args[0]} equipped.`, message.origin)
                } else {
                    bot.post(`You do not have ${parsed.args[0]} equipped.`, message.origin)
                }
            } else {
                bot.post(db.data[message.author].equipped.join(', '), message.origin)
            }
        } else if (parsed.command == 'stocks') {
            bot.post(`sell price: ${trade.sell}\nreturn: ${trade.get}`, message.origin)
        } else if (parsed.command == 'update') {
            bot.post(notes, message.origin)
        } else if (parsed.command == 'help') {
            bot.post('https://femboy-meter-docs.jaxonbaxon.repl.co', message.origin)
        } else if (parsed.command == 'notify' && db.data.hasOwnProperty(message.author)) {
            db.data[message.author].notify = !db.data[message.author].notify
            bot.post(`Set notifications to ${db.data[message.author].notify}`, message.origin)
        }
        await db.write()
    }
})

setInterval(async () => { await db.write() }, 5000)
setInterval(async () => { await db.read() }, 6000)
setInterval(async () => {
    let percent = Math.floor(Math.random() * 11)
    Object.keys(db.data).forEach(user => {
        let interest = db.data[user].fembucks / 100 * percent
        db.data[user].fembucks += interest
        db.data[user].fembucks = Math.floor(db.data[user].fembucks)
    })
    bot.post('Interest collected!')
    await db.write()
}, 300000)
setInterval(async () => { 
    trade = { sell: Math.floor(Math.random() * 21) + 1, get: Math.floor(Math.random() * 21) + 6 }
    if (trade.sell < trade.get) {
        let num = Math.floor(Math.random() * 51)
        Object.keys(db.data).forEach(user => {
            if (db.data[user].luckynum == num && db.data[user].notify) {
                bot.post(`@${user}, stakes are high!`)
            }
        })
    }
}, 30000)

bot.login()
