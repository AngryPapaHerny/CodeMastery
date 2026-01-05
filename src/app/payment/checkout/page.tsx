import { Checkout } from '@/components/payment/Checkout';

export default function CheckoutPage() {
    return (
        <div className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
            <Checkout price={330000} />
        </div>
    );
}
