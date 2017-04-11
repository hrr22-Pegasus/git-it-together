import React from 'react';


var About = () => (
  <div className="container-fluid our-team">

  <button type="button" data-toggle="modal" data-target="#myModal">
    Our Team
  </button>

  <div className="modal fade show" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: 'none'}} >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">About us</h5>
          <button  type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div className="modal-body">

          <a target="_blank" href="https://www.linkedin.com/in/misakimatsumoto/">
            <div className="profiles">
              <p className="name">Misaki Matsumoto</p>
              <img src="/client/assets/misaki.jpg" />
            </div>
          </a>

          <a target="_blank" href="https://www.linkedin.com/in/samykebaish">
            <div className="profiles">
              <p className="name">Samy Kebaish</p>
              <img src="/client/assets/samy.jpg" />
            </div>
          </a>

          <a target="_blank" href="https://www.linkedin.com/in/jesse-hill-89b26b62">
            <div className="profiles">
              <p className="name">Jesse Hill</p>
              <img src="/client/assets/jesse.jpg" />
            </div>
          </a>

          <a target="_blank" href="https://www.linkedin.com/in/ryanaperry/">
            <div className="profiles">
              <p className="name">Ryan Perry</p>
              <img src="/client/assets/ryan.jpg" />
            </div>
          </a>

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
  )

module.exports = About;
