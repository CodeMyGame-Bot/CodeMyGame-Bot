const { SlashCommandBuilder, SlashCommandIntegerOption } = require('discord.js');

const operators = {
    'add': '+',
    'subtract': '-',
    'multiply': '*',
    'divide': '/'
};

const isString = (val) => typeof val == 'string' || val instanceof String;

module.exports = {
    description: 'Random math functions!',
    category: 'utility',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('math')
        .setDescription('Random math functions!')
        .addSubcommandGroup(subcommandgroup => 
            subcommandgroup
                .setName('arithmetic')
                .setDescription('Basic arithmetic functions!')
                .addSubcommand(subcommand => 
                    subcommand
                    .setName('add')
                    .setDescription('Adds two numbers!')
                    .addIntegerOption(option => 
                        option
                            .setName('num1')
                            .setDescription('The first number to add (augend)')
                            .setMinValue(-Number.MAX_SAFE_INTEGER)
                            .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                    )
                    .addIntegerOption(option =>
                        option
                            .setName('num2')
                            .setDescription('The number to add to the first number (addend)')
                            .setMinValue(-Number.MAX_SAFE_INTEGER)
                            .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                    )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('subtract')
                        .setDescription('Subtracts two numbers!')
                        .addIntegerOption(option =>
                            option
                                .setName('num1')
                                .setDescription('The first number to subtract (minuend)')
                                .setMinValue(-Number.MAX_SAFE_INTEGER)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('num2')
                                .setDescription('The number to subtract from the first number (subtrahend)')
                                .setMinValue(-Number.MAX_SAFE_INTEGER)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('multiply')
                        .setDescription('Multiplies two numbers! (supports string multiplication)')
                        .addStringOption(option => 
                            option
                                .setName('num1')
                                .setDescription('The first value to multiply!')
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option
                                .setName('num2')
                                .setDescription('The second value to multiply!')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('divide')
                        .setDescription('Divides two numbers!')
                        .addIntegerOption(new SlashCommandIntegerOption()
                            .setName('num1')
                            .setDescription('The first number to divide (dividend)')
                            .setMinValue(-Number.MAX_SAFE_INTEGER)
                            .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                        )
                        .addIntegerOption(new SlashCommandIntegerOption()
                            .setName('num2')
                            .setDescription('The number to divide the first number by (divisor)')
                            .setMinValue(-Number.MAX_SAFE_INTEGER)
                            .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
                .setName('geometry')
                .setDescription('Basic geometry functions!')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('area_triangle')
                        .setDescription('Area of a triangle!')
                        .addIntegerOption(option =>
                            option
                                .setName('base')
                                .setDescription('The base length of the triangle')
                                .setMinValue(0)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('height')
                                .setDescription('The height of the triangle')
                                .setMinValue(0)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('area_circle')
                        .setDescription('Area of a circle!')
                        .addIntegerOption(option =>
                            option
                                .setName('radius')
                                .setDescription('The radius of the circle')
                                .setMinValue(0)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('circumference')
                        .setDescription('Circumference of a circle! (input either radius or diameter, not both)')
                        .addIntegerOption(option =>
                            option
                                .setName('radius')
                                .setDescription('The radius of the triangle')
                                .setMinValue(0)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('diameter')
                                .setDescription('The diameter of the triangle')
                                .setMinValue(0)
                                .setMaxValue(Number.MAX_SAFE_INTEGER)
                        )
                )
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommandGroup()) {
            case 'arithmetic':
                let result;
                let reply = `${interaction.options.getString('num1')} ${operators[interaction.options.getSubcommand()]} ${interaction.options.getString('num2')} = `;
                switch (interaction.options.getSubcommand()) {
                    case 'add':
                        result = interaction.options.getInteger('num1') + interaction.options.getInteger('num2');
                        break;
                    case 'subtract':
                        result = interaction.options.getInteger('num1') - interaction.options.getInteger('num2');
                        break;
                    case 'multiply':
                        let num1 = interaction.options.getString('num1');
                        let num2 = interaction.options.getString('num2');

                        num1 = isNaN(num1) ? num1 : parseInt(num1, 10);
                        num2 = isNaN(num2) ? num2 : parseInt(num2, 10);
                        
                        if (!isString(num1) && !isString(num2)) {
                            result = num1 * num2;
                        } else if (isString(num1) && isString(num2)) {
                            return await interaction.reply('Both values can\'t be strings!');
                        } else if (isString(num1)) {
                            if ((reply + num1.repeat(num2)).length > 2000) {
                                return await interaction.reply(`I'm sorry, the result for ${interaction.options.getString('num1')} * ${interaction.options.getString('num2')} is too big to display in Discord`);
                            }
                            result = num1.repeat(num2);
                        } else if (isString(num2)) {
                            if ((reply + num2.repeat(num1)).length > 2000) {
                                return await interaction.reply(`I'm sorry, the result for ${interaction.options.getString('num1')} * ${interaction.options.getString('num2')} is too big to display in Discord`);
                            }
                            result = num2.repeat(num1);
                        }

                        break;
                    case 'divide':
                        if (interaction.options.getInteger('num2') == 0) {
                            return await interaction.reply({ content: 'You can\'t divide by zero!', ephemeral: true });
                        }
                        result = interaction.options.getInteger('num1') / interaction.options.getInteger('num2');
                        break;
                }

                await interaction.reply(reply + result.toString());
            case 'geometry':
                let area;
                switch (interaction.options.getSubcommand()) {
                    case 'area_triangle':
                        area = 0.5 * interaction.options.getInteger('base') * interaction.options.getInteger('height');
                        await interaction.reply(`The area of a triangle with base ${interaction.options.getInteger('base')} and height ${interaction.options.getInteger('height')} is ${area} units squared`);
                        break;
                    case 'area_circle':
                        area = Math.PI * (interaction.options.getInteger('radius') ** 2);
                        await interaction.reply(`The area of a circle with radius ${interaction.options.getInteger('radius')} is ${area} units squared`);
                        break;
                    case 'circumference':
                        if (interaction.options.getInteger('radius') && interaction.options.getInteger('diameter')) {
                            return await interaction.reply('Either radius or diameter is required; not both');
                        }

                        let circumference;

                        if (interaction.options.getInteger('radius')) {
                            circumference = 2 * Math.PI * interaction.options.getInteger('radius');
                            await interaction.reply(`The circumference of a circle with radius ${interaction.options.getInteger('radius')} is ${circumference}`);
                        } else if (interaction.options.getInteger('diameter')) {
                            circumference = Math.PI * interaction.options.getInteger('diameter'); 
                            await interaction.reply(`The circumference of a circle with diameter ${interaction.options.getInteger('diameter')} is ${circumference}`);
                        }
                        break;
                }
        }
    }
};