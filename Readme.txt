----------------------가능 목록 ----------------------

프론트 엔드 적용

📫  회원가입 Post
📫  로그인
📫  로그아웃

📫  캐릭서 생성
📫  캐릭터 선택
📫  캐릭터 삭제

📫  아이템 생성
📫  아이템 삭제

📫  아이템 장착
📫  아이템 해제

header 인증 사용


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

cd ~
cd Downloads

ssh -i sparta_keypair.pem ubuntu@ 주소

pm2 kill

pm start 