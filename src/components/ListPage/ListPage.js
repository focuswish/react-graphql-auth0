import React from 'react';
import PropTypes from 'prop-types';
import Post from '../Post';
import subscription from './subscription';
import CreatePost from '../CreatePost';


class ListPage extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading) {
      if (this.subscription) {
        if (nextProps.data.allPosts !== this.props.data.allPosts) {
          // if the feed has changed, we need to unsubscribe before resubscribing
          this.subscription();
        } else {
          // we already have an active subscription with the right params
          return;
        }
      }
      this.subscription = nextProps.data.subscribeToMore(subscription);
    }
  }

  render() {
    if (this.props.data.loading) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <div>
          {this.props.data.allPosts.map(post =>
            <Post key={post.id} post={post} />,
          )}
        </div>
        <CreatePost />
      </div>
    );
  }
}

ListPage.propTypes = {
  data: PropTypes.object,
};

export default ListPage;