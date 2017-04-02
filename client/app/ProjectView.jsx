import React, { Component } from 'react';
import Deliverable from './Deliverable.jsx';
import Resource from './Resource.jsx';
import ChatApp from './chatRoom.jsx';
import Schedule from './Schedule.jsx';
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
      return (<div className="chat-section">
           <DrawCanvas />
          </div>)
    } else if (section === 'Resources') {
      return (<div className="resources-section">
                <h2>Resources</h2>
                <hr />
                <Resource.List project={project} />
                <hr />
                <Resource.Form projectid={project.id} user={profile.nickname} room={project.name} />
              </div>);
    } else if (section === 'Schedule') {
      return (<div className="chat-section">
            <Schedule project={project} />
          </div>)
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
							<div className="col-sm-8 project-section">
                <a className="repo-nav" target="_blank" href={'https://github.com/' + project.owner + '/' + project.name.replace(/ /g, '-').toLowerCase()}>{project.name}</a>
                &nbsp;<button type="submit" className="delete" onClick={() => deleteProject(project.id)}><i className="fa fa-trash"></i></button>
                <hr />
                <p className="repo-content">{project.description}</p>
              </div>
							<div className=".col-sm-4 devider-section">
                <table>
                  <tr>
    							<th><select className="custom-select text-center" id="deliverable-input-status1"
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
    							</select></th>
    								<th><select className="custom-select text-center" id="deliverable-input-status2"
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
                  </select></th>
                  </tr>
							    <tr>
    							<th><select className="custom-select text-center" id="deliverable-input-status3"
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
                  </select></th>
								
    							<th><select className="custom-select text-center" id="deliverable-input-status4"
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
                  </select></th>
                </tr>
              </table>
          </div>
          <div className="col-sm-12 row chat-row">
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-left" id="section1">
              {this.state.upperLeftResult}
            </div>
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-right" id="section2">
              {this.state.upperRightResult}
            </div>
          </div>
          <div className="col-sm-12 row chat-row">
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-left" id="section3">
              {this.state.bottomLeftResult}
            </div>
            <div className="col-xs-12 col-sm-12 col-lg-6 project-view-component project-view-component-right" id="section4">
              {this.state.bottomRightResult}
            </div>

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