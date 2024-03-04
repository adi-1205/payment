module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
        title: DataTypes.STRING,
        excerpt: DataTypes.TEXT,
        body:DataTypes.TEXT,
        url: DataTypes.STRING,
        is_premium: DataTypes.BOOLEAN
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        tableName: 'Blog',
    })

    Blog.associate = function (models) {  
       this.belongsTo(models.User,{
        foreignKey: "author_id"
       })   
    }
    return Blog
}