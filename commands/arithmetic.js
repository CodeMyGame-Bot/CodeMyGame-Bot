const { SlashCommandBuilder, SlashCommandIntegerOption } = require('discord.js');

const operators = {
    'add': '+',
    'subtract': '-',
    'multiply': '*',
    'divide': '/'
}

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
                            // .setMinValue(-Number.MAX_SAFE_INTEGER)
                            // .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                    )
                    .addIntegerOption(option =>
                        option
                            .setName('num2')
                            .setDescription('The number to add to the first number (addend)')
                            // .setMinValue(-Number.MAX_SAFE_INTEGER)
                            // .setMaxValue(Number.MAX_SAFE_INTEGER)
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
                                // .setMinValue(-Number.MAX_SAFE_INTEGER)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('num2')
                                .setDescription('The number to subtract from the first number (subtrahend)')
                                // .setMinValue(-Number.MAX_SAFE_INTEGER)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('multiply')
                        .setDescription('Multiplies two numbers!')
                        .addIntegerOption(option =>
                            option
                                .setName('num1')
                                .setDescription('The first number to multiply (multiplicand)')
                                // .setMinValue(-Number.MAX_SAFE_INTEGER)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('num2')
                                .setDescription('The number to multiply with the first number (multiplier)')
                                // .setMinValue(-Number.MAX_SAFE_INTEGER)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
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
                            // .setMinValue(-Number.MAX_SAFE_INTEGER)
                            // .setMaxValue(Number.MAX_SAFE_INTEGER)
                            .setRequired(true)
                        )
                        .addIntegerOption(new SlashCommandIntegerOption()
                            .setName('num2')
                            .setDescription('The number to divide the first number by (divisor)')
                            // .setMinValue(-Number.MAX_SAFE_INTEGER)
                            // .setMaxValue(Number.MAX_SAFE_INTEGER)
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
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                                .setRequired(true)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('height')
                                .setDescription('The height of the triangle')
                                .setMinValue(0)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
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
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
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
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                        )
                        .addIntegerOption(option =>
                            option
                                .setName('diameter')
                                .setDescription('The diameter of the triangle')
                                .setMinValue(0)
                                // .setMaxValue(Number.MAX_SAFE_INTEGER)
                        )
                )
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommandGroup()) {
            case 'arithmetic':
                // if (
                //     interaction.options.get('num1') > Number.MAX_SAFE_INTEGER
                //     || interaction.options.get('num2') > Number.MAX_SAFE_INTEGER
                //     || interaction.options.get('num1') < -Number.MAX_SAFE_INTEGER
                //     || interaction.options.get('num2') < -Number.MAX_SAFE_INTEGER
                //     ) return await interaction.reply({ content: 'The integers you provided exceed the max limits the bot can handle!', ephemeral: true });
                let result;
                switch (interaction.options.getSubcommand()) {
                    case 'add':
                        result = interaction.options.getInteger('num1') + interaction.options.getInteger('num2');
                        break;
                    case 'subtract':
                        result = interaction.options.getInteger('num1') - interaction.options.getInteger('num2');
                        break;
                    case 'multiply':
                        result = interaction.options.getInteger('num1') * interaction.options.getInteger('num2');
                        break;
                    case 'divide':
                        if (interaction.options.getInteger('num2') == 0) {
                            return await interaction.reply({ content: 'You can\'t divide by zero!', ephemeral: true });
                        }
                        result = interaction.options.getInteger('num1') / interaction.options.getInteger('num2');
                        break;
                }
                await interaction.reply(`${interaction.options.getInteger('num1')} ${operators[interaction.options.getSubcommand()]} ${interaction.options.getInteger('num2')} = ${result}`);
            case 'geometry':
                let area;
                switch (interaction.options.getSubcommand()) {
                    case 'area_triangle':
                        area = 0.5 * interaction.options.getInteger('base') * interaction.options.getInteger('height');
                        await interaction.reply(`The area of a triangle with base ${interaction.options.getInteger('base')} and height ${interaction.options.getInteger('height')} is ${area} units squared`);
                        break;
                    case 'area_circle':
                        area = Math.PI * (interaction.options.getInteger('radius') ** 2)
                        await interaction.reply(`The area of a circle with radius ${interaction.options.getInteger('radius')} is ${area} units squared`)
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