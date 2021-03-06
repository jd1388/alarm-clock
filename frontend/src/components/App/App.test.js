import React from 'react';
import { shallow } from 'enzyme';
import Chance from 'chance';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import App from './App';
import Alarm from '../Alarm';

describe('App', () => {
  let wrapper;
  let chance;

  const generateFakeTime = () => {
    const convertToTwoDigitNumber = number => number.length === 1 ? `0${number}` : number;

    const randomHour = convertToTwoDigitNumber(`${chance.hour({ twentyfour: true })}`);
    const randomMinute = convertToTwoDigitNumber(`${chance.minute()}`);

    return {
      randomHour,
      randomMinute,
      randomTime: `${randomHour}:${randomMinute}`,
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

  describe('Alarm Container', () => {
    let alarmContainer;

    beforeEach(() => {
      alarmContainer = wrapper.childAt(1);
    });

    it('is a div', () => {
      expect(alarmContainer.type()).toEqual('div');
    });

    describe('Given there are no alarms in the app state', () => {
      let alarms;

      beforeEach(() => {
        wrapper.setState({ alarms: [] });
        alarmContainer = wrapper.childAt(1);
        alarms = alarmContainer.children();
      });

      it('contains no alarms', () => {
        expect(alarms).toHaveLength(0);
      });
    });

    describe('Given there are alarms in the app state', () => {
      let alarms;
      let fakeAlarms;

      beforeEach(() => {
        fakeAlarms = chance.n(() => generateFakeTime().randomTime, chance.d6());

        wrapper.setState({ alarms: fakeAlarms });
        alarmContainer = wrapper.childAt(1);
        alarms = alarmContainer.children();
      });

      it('contains the correct number of alarms', () => {
        expect(alarms).toHaveLength(fakeAlarms.length);
      });

      it('displays as the Alarm component for each', () => {
        alarms.forEach(alarm => {
          expect(alarm.type()).toEqual(Alarm);
        });
      });

      it('passes the time for the alarm for each', () => {
        alarms.forEach((alarm, index) => {
          expect(alarm.props().children).toEqual(fakeAlarms[index]);
        });
      });
    });
  });

  describe('Add Alarm FAB', () => {
    let addAlarmFab;

    beforeEach(() => {
      addAlarmFab = wrapper.childAt(2);
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

      addAlarmFab = wrapper.childAt(2);

      const { onClick } = addAlarmFab.props();

      onClick();

      expect(wrapper.state().isAddAlarmDialogOpen).toBeTruthy();
    });

    it('sets the state variable for the new alarm time to the current time', () => {
      const { randomHour, randomMinute, randomTime } = generateFakeTime();

      Date = class extends Date {
        getHours() {
          return randomHour;
        }

        getMinutes() {
          return randomMinute;
        }
      };

      wrapper = shallow(<App/>);
      addAlarmFab = wrapper.childAt(2);

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
  });

  describe('Add Alarm Dialog', () => {
    let addAlarmDialog;

    beforeEach(() => {
      addAlarmDialog = wrapper.childAt(3);
    });

    it('is a Dialog component', () => {
      expect(addAlarmDialog.type()).toEqual(Dialog);
    });

    it('has the state variable for if the dialog is open passed as the open prop', () => {
      const isAddAlarmDialogOpen = chance.bool();

      wrapper.setState({ isAddAlarmDialogOpen });

      addAlarmDialog = wrapper.childAt(3);

      expect(addAlarmDialog.props().open).toEqual(isAddAlarmDialogOpen);
    });

    it('sets the state variable for if the add alarm dialog is open to true when closed', () => {
      const isAddAlarmDialogOpen = chance.bool();

      wrapper.setState({ isAddAlarmDialogOpen });

      addAlarmDialog = wrapper.childAt(3);

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

    describe('Dialog Content', () => {
      let dialogContent;

      beforeEach(() => {
        dialogContent = addAlarmDialog.childAt(1);
      });

      it('is a DialogContent component', () => {
        expect(dialogContent.type()).toEqual(DialogContent);
      });

      describe('Time Input', () => {
        let timeInput;

        beforeEach(() => {
          timeInput = dialogContent.childAt(0);
        });

        it('is a TextField component', () => {
          expect(timeInput.type()).toEqual(TextField);
        });

        it('has the type prop set to time', () => {
          expect(timeInput.props().type).toEqual('time');
        });

        it('has a default value of the current time', () => {
          const { randomHour, randomMinute, randomTime } = generateFakeTime();

          Date = class extends Date {
            getHours() {
              return randomHour;
            }

            getMinutes() {
              return randomMinute;
            }
          };

          wrapper = shallow(<App/>);
          addAlarmDialog = wrapper.childAt(3);
          dialogContent = addAlarmDialog.childAt(1);
          timeInput = dialogContent.childAt(0);

          expect(timeInput.props().defaultValue).toEqual(randomTime);
        });

        it('updates the time stored in the app state when changed', () => {
          const { randomTime } = generateFakeTime();
          const fakeEvent = {
            target: {
              value: randomTime,
            },
          };

          const { onChange } = timeInput.props();

          onChange(fakeEvent);

          expect(wrapper.state().newAlarmTime).toEqual(randomTime);
        });
      });
    });

    describe('Dialog Actions', () => {
      let dialogActions;

      beforeEach(() => {
        dialogActions = addAlarmDialog.childAt(2);
      });

      it('is a DialogActions component', () => {
        expect(dialogActions.type()).toEqual(DialogActions);
      });

      describe('Cancel Button', () => {
        let cancelButton;
  
        beforeEach(() => {
          cancelButton = dialogActions.childAt(0);
        });
  
        it('is a Button component', () => {
          expect(cancelButton.type()).toEqual(Button);
        });

        it('displays the correct text', () => {
          const cancelButtonText = cancelButton.childAt(0).text();

          expect(cancelButtonText).toEqual('Cancel');
        });

        it('closes the dialog when clicked', () => {
          wrapper.setState({ isAddAlarmDialogOpen: true });
          addAlarmDialog = wrapper.childAt(3);
          dialogActions = addAlarmDialog.childAt(2);
          cancelButton = dialogActions.childAt(0);

          const { onClick } = cancelButton.props();

          onClick();

          expect(wrapper.state.isAddAlarmDialogOpen).toBeFalsy();
        });
      });

      describe('Add Button', () => {
        let addButton;

        beforeEach(() => {
          addButton = dialogActions.childAt(1);
        });

        it('is a Button component', () => {
          expect(addButton.type()).toEqual(Button);
        });

        it('displays the correct text', () => {
          const addButtonText = addButton.childAt(0).text();

          expect(addButtonText).toEqual('Add');
        });

        it('closes the dialog when clicked', () => {
          wrapper.setState({ isAddAlarmDialogOpen: true });
          addAlarmDialog = wrapper.childAt(3);
          dialogActions = addAlarmDialog.childAt(2);
          addButton = dialogActions.childAt(1);

          const { onClick } = addButton.props();

          onClick();

          expect(wrapper.state.isAddAlarmDialogOpen).toBeFalsy();
        });

        it('adds the new alarm to the alarms in state', () => {
          const fakeAlarms = chance.n(() => generateFakeTime().randomTime, chance.d6());
          const fakeNewAlarm = generateFakeTime().randomTime;

          wrapper.setState({ isAddAlarmDialogOpen: true, newAlarmTime: fakeNewAlarm, alarms: fakeAlarms });
          addAlarmDialog = wrapper.childAt(3);
          dialogActions = addAlarmDialog.childAt(2);
          addButton = dialogActions.childAt(1);

          const { onClick } = addButton.props();

          onClick();

          const expectedAlarms = [...fakeAlarms, fakeNewAlarm];

          expect(wrapper.state().alarms).toEqual(expectedAlarms);
        });
      });
    });
  });
});
