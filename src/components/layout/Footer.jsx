import React from 'react';
import Cookies from 'js-cookie';

function Footer() {
  return (
    <div
      className={
        'footer ' + (Cookies.get('bg-theme') === 'dark' ? 'dark-background-1' : 'light-background')
      }
    >
      <p className="text-center">
        <a target="_blank" rel="noreferrer" href="https://limeacademy.tech/">
          <img
            src="https://limeacademy.tech/wp-content/uploads/2021/08/limeacademy_logo.svg"
            alt=""
          />
        </a>
      </p>
    </div>
  );
}

export default Footer;
