const tutorialSteps = {
    'mainpage': [
      {
        selector: '.logo-placeholder',
        text: '안녕하세요! 밥심앱에 오신 것을 환영합니다. 여기가 우리 앱의 홈 버튼이에요! 🍚'
    },
    {
        selector: '.info-block:nth-child(1)',
        text: '이 카드들에서 우리 서비스의 주요 기능을 확인할 수 있어요.'
    },
    {
        selector: '.nav-btn.auth-btn[data-action="signup"]',
        text: '아직 계정이 없으시면 여기서 회원가입을 시작하세요!'
    },
    {
        selector: '.nav-btn.auth-btn[data-action="login"]',
        text: '이미 계정이 있으시면 로그인 버튼을 눌러주세요.'
    },
    {
        selector: '.nav-btn.theme-toggle-btn',
        text: '다크모드와 라이트모드를 전환할 수 있어요. 취향에 맞게 선택하세요! 🌙'
    }
    ],
    
  
    'login': [
    {
        selector: '#email',
        text: '이메일 주소를 입력해주세요. 가입할 때 사용한 이메일이에요!'
    },
    {
        selector: '#password',
        text: '비밀번호를 입력하세요. 안전하게 보호되니 걱정마세요! 🔒'
    },
    {
        selector: '#remember',
        text: '이 체크박스를 선택하면 다음에 자동으로 로그인돼요.'
    },
    {
        selector: '.submit-btn',
        text: '모든 정보를 입력했다면 이 버튼을 눌러 로그인하세요!'
    },
    {
        selector: '.signup-link a',
        text: '아직 계정이 없으시면 여기를 클릭해서 회원가입하세요!'
    }
    ],
    'signup': [
      
    {
        selector: '.user-type-selection',
        text: '먼저 계정 유형을 선택하세요! 공급자는 식당 주인, 소비자는 일반 사용자예요.'
    },
    {
        selector: '#email',
        text: '이메일 주소를 입력하세요. 로그인할 때 사용할 아이디예요!'
    },
    {
        selector: '#name',
        text: '이름을 입력해주세요. 실명을 사용하시는 것을 권장해요.'
    },
    {
        selector: '#phone',
        text: '전화번호를 입력하세요. 010-1234-5678 형식으로 입력해주세요!'
    },
    {
        selector: '#password',
        text: '안전한 비밀번호를 만드세요. 8자 이상이어야 해요! 강도 표시를 확인하세요.'
    },
    {
        selector: '#password-confirm',
        text: '같은 비밀번호를 한 번 더 입력해서 확인해주세요.'
    },
    {
        selector: '#terms',
        text: '이용약관에 동의해주세요. 필수로 체크해야 가입할 수 있어요!'
    },
    {
        selector: '.submit-btn',
        text: '모든 정보를 입력했다면 이 버튼을 눌러 가입을 완료하세요! 🎉'
    }
    ],

  
    'dashboard': [
        // steps for dashboard
    ],
    // ... etc for all pages
};
