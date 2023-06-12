import React from 'react';
import { Link } from 'react-router-dom';

function Styleguide() {
  return (
    <div className="container my-5">
      <h1>Styleguide</h1>

      <h2 className="text-display mt-10">Colors</h2>
      <hr className="mt-3 mb-6" />

      <h3 className="text-headline mb-4">Main</h3>

      <div className="row mb-4">
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-primary text-white text-center"
          >
            Primary
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-secondary text-white text-center"
          >
            Secondary
          </div>
        </div>
      </div>

      <h3 className="text-headline mb-4">System</h3>

      <div className="row mb-4">
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-success text-white text-center"
          >
            Success
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-danger text-white text-center"
          >
            Danger
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-warning text-white text-center "
          >
            Warning
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div
            style={{ height: '64px', lineHeight: '64px', borderRadius: '2px' }}
            className="mb-2 bg-info text-white text-center"
          >
            Info
          </div>
        </div>
      </div>

      <h2 className="text-display mt-10">Typography</h2>
      <hr className="mt-3 mb-6" />

      <div className="mb-4">
        <div className="row">
          <div className="col-md-5">
            <code>.heading-large</code>
            <h2 className="heading-large mt-3">The quick brown fox jumps over the lazy dog</h2>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />

      <div className="mb-4">
        <div className="row">
          <div className="col-md-5">
            <code>.heading-medium</code>
            <h2 className="heading-medium mt-3">The quick brown fox jumps over the lazy dog</h2>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />

      <div className="mb-4">
        <div className="row">
          <div className="col-md-5">
            <code>.heading-small</code>
            <h2 className="heading-small mt-3">The quick brown fox jumps over the lazy dog</h2>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <code>.text-lead</code>
            <p className="text-lead mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />

      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <code>.text-main</code>
            <p className="text-main mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>

      <hr className="mt-6 mb-6" />

      <div className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <code>.text-small</code>
            <p className="text-small mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>

      <Link to="/">Back</Link>
    </div>
  );
}

export default Styleguide;
