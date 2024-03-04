module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        username: DataTypes.STRING,
        by_google: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        subscription: DataTypes.STRING,
        subscription_end: DataTypes.DATE,
        is_creator: DataTypes.BOOLEAN,
        stripe_cus_id: DataTypes.STRING
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        tableName: 'User',
    })

    User.associate = function (models) {
        this.hasMany(models.Blog, {
            foreignKey: "author_id",
            onDelete: 'cascade',
            hooks: true,
        });
        // this.hasMany(models.Chat, {
        //     foreignKey: "sender_id",
        //     onDelete: 'cascade',
        //     hooks: true,
        // });
    }
    return User
}