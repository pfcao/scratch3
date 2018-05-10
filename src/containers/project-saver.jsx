import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import PouchDB from 'pouchdb';
window.db = new PouchDB('scratch0')

class ProjectSaver extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveProject'
        ]);
    }
    saveProject () {
        let doc
        db.get('doc').then((d)=>doc = d
            ).catch(()=> db.put({_id:'doc'}).then((r)=>doc=r)
            )
        this.props.vm.saveProjectSb3().then(content => {
            console.log('start saving')
            // TODO user-friendly project name
            // File name: project-DATE-TIME
            const date = new Date();
            const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
            db.putAttachment('doc', `att.sb3`,
            doc._rev,
            content, 'application/zip')

        });
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.saveProject, props);
    }
}
/**
 * Project saver component passes a saveProject function to its child.
 * It expects this child to be a function with the signature
 *     function (saveProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <ProjectSaver>{(saveProject, props) => (
 *     <MyCoolComponent
 *         onClick={saveProject}
 *         {...props}
 *     />
 * )}</ProjectSaver>
 */
class ProjectSaver2 extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveProject'
        ]);
    }
    saveProject () {
        const saveLink = document.createElement('a');
        document.body.appendChild(saveLink);

        this.props.vm.saveProjectSb3().then(content => {
            console.log(content, 999)
            const url = window.URL.createObjectURL(content);
            console.log('url..', url)
            saveLink.href = url;

            // TODO user-friendly project name
            // File name: project-DATE-TIME
            const date = new Date();
            const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
            saveLink.download = `untitled-project-${timestamp}.sb3`;
            saveLink.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(saveLink);
        });
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.saveProject, props);
    }
}

ProjectSaver.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.vm
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(ProjectSaver);
