DEVICE_ID="potato"
yarn webpack
cd public
echo "Packaging..."
ares-package .
echo "Installing..."
ares-install uk.half-shot.matrixtv_0.0.1_all.ipk -d $DEVICE_ID
echo "Running..."
ares-launch uk.half-shot.matrixtv -d $DEVICE_ID