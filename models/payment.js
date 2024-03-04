
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        tableName: 'Payment',
    })

    Payment.associate = function (models) {    
    }
    return Payment
}