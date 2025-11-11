import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import withRoot from './withRoot.js';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import { TextField } from '@mui/material';

const styles = theme => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    overflowY: 'visible',
  },
});

class TextInputDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
    };
    this.textFieldRef = React.createRef();
  }

  componentDidMount() {
    // Focus the text field when dialog opens
    if (this.textFieldRef.current) {
      this.textFieldRef.current.focus();
      this.textFieldRef.current.select();
    }
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.value);
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit(event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.handleClose();
    }
  };

  render() {
    const { classes, title, label } = this.props;
    return (
      <div>
        <Dialog
          id="text-input-dialog"
          className={classes.root}
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={this.handleSubmit}>
            <DialogContent classes={{root: classes.content}}>
              <TextField
                autoFocus
                margin="dense"
                label={label}
                type="text"
                fullWidth
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                inputRef={this.textFieldRef}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary" id="cancel">
                Cancel
              </Button>
              <Button type="submit" color="primary" id="submit">
                OK
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

TextInputDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withRoot(withStyles(TextInputDialog, styles));

