import { FormattedOrderSpecification, OfferCreateTransaction } from '../../common/types/objects/index';
declare function parseOrder(tx: OfferCreateTransaction): FormattedOrderSpecification;
export default parseOrder;
