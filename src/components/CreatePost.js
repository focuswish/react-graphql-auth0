import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { graphql, gql } from 'react-apollo'
import Btn from './Btn'
import Input from './Input'

class CreatePost extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      description: '',
      title: '',
    }

    this.handlePost = this.handlePost.bind(this)
  }

  componentDidMount() {
    console.log(this.props)
  }

  handlePost() {
    const {description, title} = this.state
    this.props.createPost({description, title})
      .then(() => {
        this.props.history.push('/')
      })
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    // redirect if no user is logged in
    if (!this.props.data.user) {
      console.warn('only logged in users can create new posts')
      return (
        <Redirect to={{
          pathname: '/'
        }}/>
      )
    }

    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <Input 
            placeholder="Title"
            value={this.state.title} 
            onChange={e => this.setState({title: e.target.value})}
          />
          <Input 
            placeholder="Description"
            value={this.state.description} 
            onChange={e => this.setState({description: e.target.value})}
          />
          {this.state.description && this.state.title &&
            <Btn><span onClick={this.handlePost}>Post</span></Btn>
          }
        </div>
      </div>
    )
  }
}

CreatePost.propTypes = {
  createPost: React.PropTypes.func,
  data: React.PropTypes.object,
}

const createPost = gql`
  mutation createPost($description: String!, $title: String!) {
    createPost(description: $description, title: $title) {
      id
      description
      title
    }
  }
`

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`

export default graphql(createPost, {
  props: ({ownProps, mutate}) => ({
    createPost: ({description, title}) => mutate({ variables: {description, title} })
  })
})(graphql(userQuery, { options: {fetchPolicy: 'network-only'}} )(withRouter(CreatePost)))
