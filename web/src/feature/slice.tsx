import { adminSlice } from './admin/adminSlice';

const Slices = {
    [adminSlice.name]: adminSlice.reducer
}

export default Slices