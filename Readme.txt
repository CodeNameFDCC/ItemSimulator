----------------------가능 목록 ----------------------


📫  회원가입 Post
http://wjdxo.shop:3018/api/register
{
	"email":"asd@naver.com",
	"loginId":"asd",
	"password":"asd"
}
📫  회원리스트 Get
http://wjdxo.shop:3018/api/users
{

}
headers authoriztion:{{authoriztion}} Request Post 로그인
📫  회원탈퇴 Del
http://wjdxo.shop:3018/api/withdraw
{

}
headers{authoriztion} Request Post 로그인
📫  로그인 Post
http://wjdxo.shop:3018/api/login
{
	"loginId":"asd",
	"password":"asd"
}
headers{authoriztion} Request Post 로그인
📫  로그아웃 Post
http://wjdxo.shop:3018/api/logout
{

}
headers{authoriztion} Request Post 로그인
📫  캐릭터생성 Post
http://wjdxo.shop:3018/api/character
{
    "nickName":"고블린"
}
headers{authoriztion} Request Post 로그인
📫  캐릭터선택 Post
http://wjdxo.shop:3018/api/character/select/c69e7c3c-f950-456a-8125-9a0dc6fd97b0
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 조회 Get
wjdxo.shop:3018/api/character/select
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 수정 Put
wjdxo.shop:3018/api/character
{
	"atkDmg":5,
	"defense":10,
	"health":100,
	"gold":9999
}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 삭제 Del
wjdxo.shop:3018/api/character/
{

}
headers{authoriztion} Request Post 로그인
📫  내 캐릭터 조회 Get
wjdxo.shop:3018/api/character
{

}
headers{authoriztion} Request Post 로그인
📫  모든 캐릭터 조회 Get
wjdxo.shop:3018/api/characters
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 인벤토리 아이템 추가 Post
http://wjdxo.shop:3018/api/inventory/item
{
	"img":"https://buly.kr/CB3YJfS","type":"고유", "name":"삼위일체", "desc":"스킬을 사용하고 나면 다음 기본 공격 시 기본 200% 물리피해를 추가로 입힙니다.", "price":3333, "addAtk":33, "addDfense":3, "addHealth":333
}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 인벤토리 아이템 조회 Get
http://wjdxo.shop:3018/api/inventory/items
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 인벤토리 아이템 삭제 Del
http://wjdxo.shop:3018/api/inventory/item/12b81e32-ffa0-4578-b740-86144c6209ef
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 인벤토리 아이템 모두 삭제 Del
http://wjdxo.shop:3018/api/inventory/items
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 아이템 구입 Post
http://wjdxo.shop:3018/api/shop/buy/1898c7d6-0187-481f-89d9-951c11450d4e
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 아이템 판매 Post
http://wjdxo.shop:3018/api/shop/sell/1898c7d6-0187-481f-89d9-951c11450d4e
{

}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 아이템 장착 Post
wjdxo.shop:3018/api/equip
{
	"itemId":"1898c7d6-0187-481f-89d9-951c11450d4e"
}
headers{authoriztion} Request Post 로그인
📫  선택된 캐릭터 장비 해제 Post
wjdxo.shop:3018/api/unequip
{
	"itemId":"1898c7d6-0187-481f-89d9-951c11450d4e"
}
headers{authoriztion} Request Post 로그인
📫  상점 추가 Post
http://wjdxo.shop:3018/api/shop
{
	"name":"일반상점", "desc":"일반적으로 흔하게 구입할 수 있는 상품을 판매합니다!"
}
headers{authoriztion} Request Post 로그인
📫  상점 리스트 조회 Get
http://wjdxo.shop:3018/api/shop
{

}
headers{authoriztion} Request Post 로그인
📫  지정 상점 아이템 추가 Post
http://wjdxo.shop:3018/api/shop/b4969a9b-61bc-4bce-b221-e9504db4c470/items
{
	"img":"https://i.namu.wiki/i/o77qWahyja9-mWN-hM3928hitx4rDGxnE_MO6M-f0Ku7Q3g6Lh7TS3feV4xeSEL0FH8jorL9XEBeeXSYP2dRywCEmoFrNObb4-WYPEHoGqZgYXMnWEdTU8RscQfINYnIsc73XSm8ifpL-wmEopdXBA.webp", "type":"고유", "name":"스태락의 도전", "desc":"기본 공격력 45%의 추가 공격력을 얻습니다.", "price":3200, "addAtk":0, "addDfense":20, "addHealth":400
}
headers{authoriztion} Request Post 로그인
📫  지정 상점 아이템 조회 Get
http://wjdxo.shop:3018/api/shop/b4969a9b-61bc-4bce-b221-e9504db4c470/items
{

}
headers{authoriztion} Request Post 로그인

📫  강제 오류 테스트 Get
http://wjdxo.shop:3018/error
{

}
----------------------------------------------


    git add .
    git commit -m ""
    git push -u origin master



-------------커밋 컨벤션------------------------
feat : 새로운 기능 추가
fix : 버그 수정
docs : 문서 수정
style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
refactor : 코드 리펙토링
test : 테스트 코드, 리펙토링 테스트 코드 추가


---------------------------------------

제거
DROP DATABASE item_simulator;

프리즈마 생성
npx prisma db push

프리즈마 마이그레이션
npx prisma migrate dev --name [명칭!!]

프리즈마 상태 확인
npx prisma studio