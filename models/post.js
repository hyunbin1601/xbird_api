const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.DataTypes.STRING(1000),
                allowNull: false,  // 무조건 값 존재
            },
            img: {
                type: Sequelize.STRING(1000),
                allowNull: true,  // 컬럼이 없을수도 있다^^
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true, //deletedAt 컬럼을 자동으로 만들어줌
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User);  // Post 테이블에 UserId 컬럼이 생김
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });  // PostHashtag 테이블이 생성됨, postId와 hashtagId 컬럼이 생성됨
    }
}

module.exports = Post;