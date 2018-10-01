import React from 'react';
import { shallow } from 'enzyme';
import Chance from 'chance';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import App from './App';

describe('App', () => {
  let wrapper;
  let chance;

  const generateFakeTime = () => {
    const randomHour = `${chance.hour({ twentyfour: true })}`;
    const randomMinute = `${chance.minute()}`;

    const convertToTwoDigitNumber = number => number.length === 1 ? `0${number}` : number;

    return {
      randomHour: convertToTwoDigitNumber(randomHour),
      randomMinute: convertToTwoDigitNumber(randomMinute),
    };
  }

  beforeEach(() => {
    chance = Chance();

    wrapper = shallow(<App />);
  });

  it('is wrapped in a div', () => {
    expect(wrapper.type()).toEqual('div');
  });

  describe('Header', () => {
    let header;

    beforeEach(() => {
      header = wrapper.childAt(0);
    });

    it('is a Typography component', () => {
      expect(header.type()).toEqual(Typography);
    });

    it('displays as the correct variant', () => {
      expect(header.props().variant).toEqual('display4');
    });

    it('uses the primary color', () => {
      expect(header.props().color).toEqual('primary');
    })

    it('displays the correct text', () => {
      const headerText = header.childAt(0).text();

      expect(headerText).toEqual('Alarm Clock');
    });
  });

  describe('Add Alarm FAB', () => {
    let addAlarmFab;

    beforeEach(() => {
      addAlarmFab = wrapper.childAt(1);
    });

    it('is a Button component', () => {
      expect(addAlarmFab.type()).toEqual(Button);
    });

    it('displays as a fab', () => {
      expect(addAlarmFab.props().variant).toEqual('fab');
    });

    it('uses the primary color', () => {
      expect(addAlarmFab.props().color).toEqual('primary');
    });

    it('sets the state variable for if the add alarm dialog is open to true', () => {
      wrapper.setState({ isAddAlarmDialogOpen: chance.bool() });

      addAlarmFab = wrapper.childAt(1);

      const { onClick } = addAlarmFab.props();

      onClick();

      expect(wrapper.state().isAddAlarmDialogOpen).toBeTruthy();
    });

    it('sets the state variable for the new alarm time to the current time', () => {
      const { randomHour, randomMinute } = generateFakeTime();
      const randomTime = `${randomHour}:${randomMinute}`;

      Date = class extends Date {
        getHours() {
          return randomHour;
        }

        getMinutes() {
          return randomMinute;
        }
      };

      wrapper = shallow(<App/>);
      addAlarmFab = wrapper.childAt(1);

      const { onClick } = addAlarmFab.props();

      onClick();

      expect(wrapper.state().newAlarmTime).toEqual(randomTime);
    });

    describe('FAB Icon', () => {
      let fabIcon;

      beforeEach(() => {
        fabIcon = addAlarmFab.childAt(0);
      });

      it('is a SvgIcon component', () => {
        expect(fabIcon.type()).toEqual(SvgIcon);
      });

      it('contains an AddIcon component', () => {
        const addIcon = fabIcon.childAt(0);

        expect(addIcon.type()).toEqual(AddIcon);
      });
    });

    describe('Add Alarm Dialog', () => {
      let addAlarmDialog;

      beforeEach(() => {
        addAlarmDialog = wrapper.childAt(2);
      });

      it('is a Dialog component', () => {
        expect(addAlarmDialog.type()).toEqual(Dialog);
      });

      it('has the state variable for if the dialog is open passed as the open prop', () => {
        const isAddAlarmDialogOpen = chance.bool();

        wrapper.setState({ isAddAlarmDialogOpen });

        addAlarmDialog = wrapper.childAt(2);

        expect(addAlarmDialog.props().open).toEqual(isAddAlarmDialogOpen);
      });

      it('sets the state variable for if the add alarm dialog is open to true when closed', () => {
        const isAddAlarmDialogOpen = chance.bool();

        wrapper.setState({ isAddAlarmDialogOpen });

        addAlarmDialog = wrapper.childAt(2);

        const { onClose } = addAlarmDialog.props();

        onClose();

        expect(wrapper.state.open).toBeFalsy();
      });

      describe('Dialog Title', () => {
        let dialogTitle;

        beforeEach(() => {
          dialogTitle = addAlarmDialog.childAt(0);
        });

        it('is a DialogTitle component', () => {
          expect(dialogTitle.type()).toEqual(DialogTitle);
        });

        it('displays the correct title text', () => {
          const titleText = dialogTitle.childAt(0).text();

          expect(titleText).toEqual('Add Alarm');
        });
      });

      describe('Time Input', () => {
        let timeInput;

        beforeEach(() => {
          timeInput = addAlarmDialog.childAt(1);
        });

        it('is a TextField component', () => {
          expect(timeInput.type()).toEqual(TextField);
        });

        it('has the type prop set to time', () => {
          expect(timeInput.props().type).toEqual('time');
        });

        it('has a default value of the current time', () => {
          const { randomHour, randomMinute } = generateFakeTime();
          const randomTime = `${randomHour}:${randomMinute}`;

          Date = class extends Date {
            getHours() {
              return randomHour;
            }

            getMinutes() {
              return randomMinute;
            }
          };

          wrapper = shallow(<App/>);
          addAlarmDialog = wrapper.childAt(2);
          timeInput = addAlarmDialog.childAt(1);

          expect(timeInput.props().defaultValue).toEqual(randomTime);
        });
      });
    });
  });
});
