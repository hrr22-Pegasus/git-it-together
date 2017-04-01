import React, { Component } from 'react';
import Deliverable from './Deliverable.jsx';
import Resource from './Resource.jsx';
import ChatApp from './chatRoom.jsx';
// import DrawCanvas from './DrawCanvas.jsx';
import DrawCanvas from './DrawCanvas.jsx';

const renderSection = (section, props) => {
  console.log(props);
  const { project, profile, deleteProject } = props;
  console.log('project', project, 'profile', profile, 'deleteProject', deleteProject);
    if (section === 'Deliverables') {
      return (<div className="deliverables-section">
          <h2>Deliverables</h2>
          <hr />
          <Deliverable.Form projectid={project.id} user={profile.nickname} room={project.name} />
          <hr />
          <Deliverable.List project={project} />
          </div>);
    } else if (section === 'ChatApp') {
      return <ChatApp user={profile.nickname} room={project.name} />
    } else if (section === 'AppearIn') {
      return <iframe src={"https://appear.in/git-it-together/" + project.name} width="100%" height="640" frameBorder="0"></iframe>
    } else if (section === 'DrawCanvas') {
      return <DrawCanvas />
    } else if (section === 'Resources') {
      return (<div className="resources-section">
                <h2>Resources</h2>
                <hr />
                <Resource.Form projectid={project.id} user={profile.nickname} room={project.name} />
                <hr />
                <Resource.List project={project} />
              </div>);
    } else if (section === 'Schedule') {
      return <Schedule />
    }
  }


class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upperLeft: 'Deliverables',
      upperLeftResult: '',
      upperRight: 'Resources',
      bottomLeft: 'DrawCanvas',
      bottomRight: 'ChatApp'
    }
    this.project = props.project;
    this.profile = props.profile;
    this.deleteProject = props.deleteProject;
  }


  render() {
    const { project, profile, deleteProject } = this.props;
    return (
      !project ? <div className="project-view">No project found</div> :
      <div className="container-fluid">
        <div className="project-view">
          <div className="row">
            <div className="col project-details">
              <a className="repo-nav" target="_blank" href={'https://github.com/' + project.owner + '/' + project.name.replace(/ /g, '-').toLowerCase()}>{project.name}</a>
              <div className="deleteBar">
              <button type="submit" className="delete" onClick={() => deleteProject(project.id)}><i className="fa fa-trash"></i></button>
              </div>
              <hr />
              <p className="repo-content">{project.description}</p>
            </div>
          </div>
          <div className="row deliverables-row">
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-left">
              <label className="sr-only" htmlFor="deliverable-input-status">Sections</label>
              <select className="custom-select text-center" id="deliverable-input-status"
                onChange={(event) =>
                  this.setState({upperLeft: event.target.value},
                    function () {
                      this.setState({upperLeftResult: renderSection(this.state.upperLeft, this.props)})
                    })
                }>
                <option value="AppearIn">AppearIn</option>
                <option value="ChatApp">ChatApp</option>
                <option value="DrawCanvas">DrawCanvas</option>
                <option value="Deliverables">Deliverables</option>
                <option value="Resources">Resources</option>
                <option value="Schedule">Schedule</option>
              </select>
              {this.state.upperLeftResult}
            </div>
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-right">
              <label className="sr-only" htmlFor="deliverable-input-status">Sections</label>
              <select className="custom-select text-center" id="deliverable-input-status"
                onChange={(event) =>
                  this.setState({upperRight: event.target.value},
                    function () {
                      this.setState({upperRightResult: renderSection(this.state.upperRight, this.props)})
                    })
                }>
                <option value="AppearIn">AppearIn</option>
                <option value="ChatApp">ChatApp</option>
                <option value="DrawCanvas">DrawCanvas</option>
                <option value="Deliverables">Deliverables</option>
                <option value="Resources">Resources</option>
                <option value="Schedule">Schedule</option>
              </select>
              {this.state.upperRightResult}
            </div>
          </div>
          <div className="row chat-row">
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-left">
              <label className="sr-only" htmlFor="deliverable-input-status">Sections</label>
              <select className="custom-select text-center" id="deliverable-input-status"
                onChange={(event) =>
                  this.setState({bottomLeft: event.target.value},
                    function () {
                      this.setState({bottomLeftResult: renderSection(this.state.bottomLeft, this.props)})
                    })
                }>
                <option value="AppearIn">AppearIn</option>
                <option value="ChatApp">ChatApp</option>
                <option value="DrawCanvas">DrawCanvas</option>
                <option value="Deliverables">Deliverables</option>
                <option value="Resources">Resources</option>
                <option value="Schedule">Schedule</option>
              </select>
              {this.state.bottomLeftResult}

            </div>
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-right">
              <label className="sr-only" htmlFor="deliverable-input-status">Sections</label>
              <select className="custom-select text-center" id="deliverable-input-status"
                onChange={(event) =>
                  this.setState({bottomRight: event.target.value},
                    function () {
                      this.setState({bottomRightResult: renderSection(this.state.bottomRight, this.props)})
                    })
                }>
                <option value="AppearIn">AppearIn</option>
                <option value="ChatApp">ChatApp</option>
                <option value="DrawCanvas">DrawCanvas</option>
                <option value="Deliverables">Deliverables</option>
                <option value="Resources">Resources</option>
                <option value="Schedule">Schedule</option>
              </select>
              {this.state.bottomRightResult}
            </div>

          </div>
        </div>
      </div>
    );

  }
}

// PropTypes tell other developers what `props` a component expects
// Warnings will be shown in the console when the defined rules are violated
Project.propTypes = {
  project: React.PropTypes.object.isRequired
};

// In the ES6 spec, files are "modules" and do not share a top-level scope
// `var` declarations will only exist globally where explicitly defined

module.exports = Project;
