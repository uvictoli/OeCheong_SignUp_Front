import React, { Component } from "react";

class Subject extends Component {
    render() {
    return (
        <h1><a href="/" onClick={function(e){
            e.preventDefault();
            this.props.onChangePage();
        }.bind(this)}>회원가입</a></h1>
    )
    }
}

export default Subject;