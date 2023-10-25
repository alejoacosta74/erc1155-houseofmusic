import * as yup from 'yup';

export const validationSchema = yup.object({
  artistName: yup.string().required('Artist name is required'),
  organizerAddress: yup.string().matches(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid ethereum address').required('Organizer address is required'),
  concertDescription: yup.string().required('Concert description is required'),
  tokenName: yup.string().required('Token name is required'),
  tokenSymbol: yup.string().required('Token symbol is required'),
  totalSupply: yup.number().min(10, 'Total supply must be greater than 10').required('Total supply is required'),
  tokenPrice: yup.number().min(0.1, 'NFT price must be greater than 0.1').required('NFT price is required'), // Updated this line
  uploadImage: yup.mixed().test('fileFormat', 'Unsupported Format', value => {
    if (!value) return false;
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
    return SUPPORTED_FORMATS.includes(value[0]?.type);
  }).required('Image file is required')
});
