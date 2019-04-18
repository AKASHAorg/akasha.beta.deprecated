import React from 'react';

const Menu = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" { ...props }
         ref={ ref }>
        <path
            d="M14,0.5 L14,0.5 L14,0.5 C14,0.776142375 13.7761424,1 13.5,1 L0.5,1 L0.5,1 C0.223857625,1 3.38176876e-17,0.776142375 0,0.5 L0,0.5 L0,0.5 C-3.38176876e-17,0.223857625 0.223857625,5.07265313e-17 0.5,0 L13.5,0 L13.5,0 C13.7761424,-5.07265313e-17 14,0.223857625 14,0.5 Z M0.5,5.5 L13.5,5.5 L13.5,5.5 C13.7761424,5.5 14,5.27614237 14,5 L14,5 L14,5 C14,4.72385763 13.7761424,4.5 13.5,4.5 L0.5,4.5 L0.5,4.5 C0.223857625,4.5 -3.38176876e-17,4.72385763 0,5 L0,5 L0,5 C3.38176876e-17,5.27614237 0.223857625,5.5 0.5,5.5 Z M0.5,10 L13.5,10 L13.5,10 C13.7761424,10 14,9.77614237 14,9.5 L14,9.5 L14,9.5 C14,9.22385763 13.7761424,9 13.5,9 L0.5,9 L0.5,9 C0.223857625,9 -3.38176876e-17,9.22385763 0,9.5 L0,9.5 L0,9.5 C3.38176876e-17,9.77614237 0.223857625,10 0.5,10 Z"/>
    </svg>
));
Menu.displayName = 'Menu';

export default Menu;
