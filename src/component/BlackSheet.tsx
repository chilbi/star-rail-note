import { styled } from '@mui/joy/styles';

const BlackSheet = styled('div', { name: 'BlackSheet' })({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  '&::before, &::after': {
    content: '""',
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    borderTopRightRadius: '24px'
  },
  '&::before': {
    top: '5px',
    left: '-5px',
    border: '1px solid #ffffff55'
  },
  '&::after': {
    top: 0,
    left: 0,
    backgroundColor: '#00000088'
  }
});

export default BlackSheet;
