const Sequelize = require('sequelize')

// 도메인 등록 기능 추가
// 도메인 모델

class Domain extends Sequelize.Model {
    static init(sequelize) {
        Domain.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'), // free, premium 2가지 옵션 존재
                allowNull: false,
            },
            clientSecret: {
                type:Sequelize.UUID,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        })
    }
    static associate(db) {
        db.Domain.belongsTo(db.User);
    }
};

module.exports = Domain;
// 도메인 모델을 만들어서 사용자와 연결, 도메인 모델은 사용자 모델과 1:N 관계를 가짐