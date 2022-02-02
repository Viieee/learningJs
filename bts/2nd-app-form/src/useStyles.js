import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  // noti card
  notificationCard: {
    '&:hover': {
      backgroundColor: '#faf6e6',
    },
  },
  // auth styling
  notFoundPageImage: {
    maxWidth: '400px',
    minWidth: '400px',
  },
  paperStyle: {
    width: 340,
    height: 470,
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    top: '40%',
    [theme.breakpoints.between(601, 1400)]: {
      top: '50%',
    },
    [theme.breakpoints.down(600)]: {
      top: '45%',
    },
  },
  innerPaperStyle: {
    overflow: 'auto',
    padding: 20,
    height: 350,
    width: 300,
    margin: '0 auto',
  },
  avatarStyle: {
    backgroundColor: '#1bbd7e',
  },
  btnstyle: {
    margin: '15px 0 10px 0',
  },
  headerStyle: {
    margin: 0,
    padding: '0px 5px',
  },
  fieldStyle: {
    width: 270,
    margin: '20px 30px 0 30px',
    padding: '2px 0',
  },
  buttonStyle: {
    width: 100,
    margin: '25px 38px 0 auto',
    display: 'block',
  },
  closeButton: {
    padding: '5px 5px',
  },
  // navbar
  badge: {
    marginRight: theme.spacing(3),
  },
  icons: {
    alignItems: 'center',
    display: (props) => (props.open ? 'none' : 'flex'),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  logoLg: {
    display: 'none',
    fontSize: '15px',
    [theme.breakpoints.up(1300)]: {
      display: 'block',
    },
  },
  logoSm: {
    display: 'block',
    [theme.breakpoints.up(1300)]: {
      display: 'none',
    },
  },
  // side drawer
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    [theme.breakpoints.down(1300)]: {
      display: 'none',
    },
  },
  mobileDrawer: {
    [theme.breakpoints.up(1300)]: {
      display: 'none',
    },
  },
  // dashboard content
  buttonAddStyleDashboard: {
    backgroundColor: 'green',
    '&:hover': {
      color: 'grey',
    },
  },
  buttonSettingsStyleDashboard: {
    backgroundColor: '#3b3737',
    marginRight: 120,
    marginBottom: 10,
    fontSize: 11,
    padding: 5,
    textAlign: 'center',
    minWidth: '40px',
    maxWidth: '40px',
    minHeight: '35px',
    maxHeight: '35px',
    '&:hover': {
      color: 'grey',
    },
    [theme.breakpoints.down(600)]: {
      marginRight: 35,
    },
    [theme.breakpoints.up(1400)]: {
      marginRight: 200,
    },
  },
  dashboardContentContainer: {
    paddingTop: theme.spacing(11),
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(8),
    },
  },
  projectContent: {
    display: 'block',
  },
  projectContentChild: {
    display: 'flex',
    paddingTop: 30,
    '& div': {
      margin: '0 40px',
    },
  },
  // 2 main tables
  cardProject: {
    width: '90%',
    height: '100%',
  },
  containerProject: {
    height: '73vh',
    overflow: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 10,
    [theme.breakpoints.down(1400)]: {
      height: '67vh',
    },
    [theme.breakpoints.down(600)]: {
      height: '70vh',
    },
    '& tr': {
      // padding: 5,
      // textAlign: 'center',
    },
    '& th': {
      // maxWidth: 100,
      // minWidth: 100,
      padding: 10,
    },
    '& td': {
      height: 40,
      padding: 5,
      // align: 'center',
    },
  },
  containerNewProjectModal: {
    width: 400,
    height: 300,
    backgroundColor: 'white',
    position: 'absolute',
    padding: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      height: '40vh',
    },
  },
  formNewProjectModal: {
    padding: theme.spacing(2),
  },
  itemNewProjectModal: {
    marginBottom: theme.spacing(3),
    '& button': {
      marginTop: 10,
    },
  },
  cardTicket: {
    width: '90%',
    height: '100%',
  },
  containerTicket: {
    overflow: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '60vh',
    [theme.breakpoints.down(1400)]: {
      height: '70vh',
    },
    [theme.breakpoints.down(600)]: {
      height: '75vh',
    },
    '& tr': {
      padding: 5,
    },
    '& th': {
      maxWidth: 100,
      minWidth: 100,
      padding: 5,
      textAlign: 'center',
    },
    '& td': {
      height: 40,
      padding: 5,
      textAlign: 'center',
    },
  },
  // project detail base
  projectDetailBase: {
    display: 'block',
  },
  projectTicketDetail: {
    display: 'flex',
    [theme.breakpoints.down(900)]: {
      display: 'block',
    },
  },
  // project detail - team member
  cardNewMember: {
    width: '28%',
    height: '100%',
    [theme.breakpoints.between(601, 1400)]: {
      width: '40%',
    },
    [theme.breakpoints.down(600)]: {
      width: '90%',
    },
  },
  containerNewMember: {
    overflow: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '40vh',
    padding: 10,
    [theme.breakpoints.up(1400)]: {
      height: '35vh',
    },
    [theme.breakpoints.down(600)]: {
      width: 'auto',
      height: '32vh',
      fontSize: 11,
    },
    '& tr': {
      overflow: 'auto',
    },
    '& th': {
      maxWidth: 220,
      minWidth: 220,
      [theme.breakpoints.down(600)]: {
        maxWidth: 50,
        minWidth: 50,
      },
      overflow: 'auto',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
    '& td': {
      [theme.breakpoints.down(1400)]: {
        height: 40,
        width: 120,
        padding: 5,
      },
      textAlign: 'center',
    },
  },
  containerNewMemberModal: {
    width: 400,
    height: 180,
    backgroundColor: 'white',
    position: 'absolute',
    padding: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      height: '22vh',
    },
  },
  containerApiKeyModal: {
    width: 'max-content',
    height: 200,
    backgroundColor: 'white',
    position: 'absolute',
    padding: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down('500')]: {
      width: '90vw',
      height: '25vh',
    },
  },
  formNewMemberModal: {
    padding: theme.spacing(2),
  },
  itemNewMemberModal: {
    marginBottom: theme.spacing(3),
    '& button': {
      marginTop: 10,
    },
  },
  // project detail - tickets
  cardProjectTicket: {
    width: '60%',
    height: '100%',
    marginLeft: 10,
    [theme.breakpoints.between(601, 1400)]: {
      width: '50%',
    },
    [theme.breakpoints.down(600)]: {
      width: '90%',
      marginLeft: 0,
      marginTop: 20,
    },
  },
  containerProjectTickets: {
    overflow: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '50vh',
    padding: 10,
    [theme.breakpoints.up(1400)]: {
      height: '40vh',
    },
    [theme.breakpoints.down(600)]: {
      width: 'auto',
      height: '32vh',
      fontSize: 11,
    },
    '& tr': {
      overflow: 'auto',
    },
    '& th': {
      maxWidth: 110,
      minWidth: 110,
      [theme.breakpoints.down(600)]: {
        maxWidth: 50,
        minWidth: 50,
      },
      overflow: 'auto',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
    '& td': {
      [theme.breakpoints.down(1400)]: {
        height: 40,
        padding: 5,
      },
      textAlign: 'center',
    },
  },
  // containerNewTicketModal: {
  //   width: 400,
  //   height: 480,
  //   backgroundColor: 'white',
  //   position: 'absolute',
  //   padding: 10,
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   margin: 'auto',
  //   [theme.breakpoints.down('sm')]: {
  //     width: '90vw',
  //     height: '58vh',
  //   },
  // },
  containerNewTicketModal: {
    width: 400,
    height: 550,
    backgroundColor: 'white',
    position: 'absolute',
    padding: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      height: '62vh',
    },
  },
  formNewTicketModal: {
    padding: theme.spacing(2),
  },
  itemNewTicketModal: {
    marginBottom: theme.spacing(3),
    '& button': {
      marginTop: 10,
    },
  },
  // ticket detail
  containerTicketDetailModalBase: {
    width: '80vw',
    height: '80vh',
    overflow: 'auto',
    backgroundColor: 'white',
    position: 'absolute',
    padding: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.down(600)]: {
      width: '90vw',
    },
  },
  ticketDetailContent: {
    display: 'flex',
    [theme.breakpoints.down(900)]: {
      display: 'block',
    },
  },
  ticketDetailCard: {
    width: '50%',
    height: '100%',
    [theme.breakpoints.down(900)]: {
      width: '100%',
      height: '25vh',
    },
  },
  // comment section
  commentSectionCard: {
    width: '50%',
    height: '100%',
    // overflow: 'auto',
    [theme.breakpoints.down(900)]: {
      width: '100%',
      height: '75vh',
    },
  },
  comments: {
    overflow: 'auto',
    width: '100%',
    height: '58vh',
  },
  // settings
  cardSettingsBase: {
    width: '60%',
    height: '80vh',
    overflow: 'auto',
    padding: 10,
    [theme.breakpoints.down(900)]: {
      width: '90%',
    },
    '& input': {
      maxWidth: 400,
      minWidth: 400,
      [theme.breakpoints.down(900)]: {
        maxWidth: 300,
        minWidth: 300,
      },
    },
    '& button': {
      marginRight: 65,
      marginTop: 15,
      [theme.breakpoints.up(1400)]: {
        marginRight: 75,
      },
      [theme.breakpoints.down(900)]: {
        marginRight: 20,
      },
    },
  },
  accountSettingsForm: {
    display: 'flex',
    [theme.breakpoints.down(900)]: {
      display: 'block',
    },
  },
  // image upload
  imageUpload: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUpload__preview: {
    width: '13rem',
    height: '13rem',
    border: '1px solid #661e38',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '1rem',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
}));
