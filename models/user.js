const Sequelize = require('sequelize'); 

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.DataTypes.STRING(50),
                allowNull: false,   // sequelize에서 컬럼이 null 값을 허용할지 여부 설정
                unique: true   // 유저 필수 조건 -> 이메일, 비밀번호, 닉네임이 있어야함
            },
            nickname: {
                type: Sequelize.DataTypes.STRING(40),
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING(100),
                allowNull: false,
            },
            provider: {  // provider와 snsId는 sns 로그인을 했을 경우에 저장하는 것
                type:Sequelize.ENUM('local', 'kakao'),  // enum은 넣을 수 있는 값을 제한하는 데이터 형식으로, 이메일/비밀번호(로컬) 형식이나 카카오 로그인 둘 중 하나만 가능하다는 의미
                allowNull: true, // sns 로그인을 하지 않았을 경우에는 null이 들어갈 수 있도록 함, allowNull은 null 값이 들어가도 가능하다는 것 -> sql에서의 NULL 말하는거 맞음
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 컬럼을 자동으로 만들어줌
            modelName: 'User',
            tableName: 'users',
            underscored: false,
            paranoid: true,  // deletedAt 컬럼을 자동으로 만들어줌 / 데이터의 복구가 가능한 기능, 실제로 데이터를 삭제하지 않고 deletedAt 컬럼에 삭제 시간을 기록
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',  // 이모티콘도 입력가능하도록 utf8mb4_general_ci로 설정
        });
    }
    static associate(db) { // 다른 모델과의 관계를 연결
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',  // Follow 테이블이 생성됨, followerId와 followingId 컬럼이 생성됨
        }); // 팔로워 목록
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',  // Follow 테이블이 생성됨, followerId와 followingId 컬럼이 생성됨
        }); // 팔로잉 목록
        db.User.hasMany(db.Domain); // domain 모델과 1:N 관계를 형성하며 연결
        // hasMany는 1:N, belongsToMany는 N:M 관계를 형성
    }
};

module.exports = User;