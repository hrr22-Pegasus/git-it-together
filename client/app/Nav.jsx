import React from 'react';

var Nav = ({profile, logout, handleProjectListEntryClick, current}) => (
  <div class="container-fluid">
    <div class="col-sm-10 project-section">
      <button className='goback' font-size="30px" onClick={() => handleProjectListEntryClick(null)} >◁</button>
    </div>
    <div class="col-sm-2 project-section">
        <img src="/client/assets/unicorn-head-silhouette.png" className="navbar-brand dropdown" alt="unicorn head"/>
          <card className="card dropdown-content">
            <card className="card-block">
              <h4 className="card-title">{profile.name}</h4>
              <p className="caption">
              <small>{profile.nickname}</small>
              </p>
              <hr/>
              <button onClick={logout} className="btn btn-primary">Sign Out</button>
            </card>
          </card>
    </div>
  </div>
);

module.exports = Nav;
