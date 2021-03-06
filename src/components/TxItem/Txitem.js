import * as React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Pkt, AddrLink } from '../CommonComps/CommonComps'
import Help from '../Help/Help'
const ItemCont = styled.div`
  min-height: 45px;
  display: flex;
  flex: 1;
  padding: 10px;
  align-items: baseline;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.pktPageBackground};
  border-radius: 4px;
  margin: 10px 0;
`

const Amount = styled.div`
  /*min-width: 145px;*/
  margin-left: 10px;
  white-space: nowrap;
  text-align: right;
`

const ScriptHashCont = styled.span`
  padding: 0.5rem;

  /* font-family: 'courier'; */
  /* font-size: 15px; */
  /* display: flex; */
  /* white-space: nowrap; */
  word-break: break-all;
  display: inline-block;
  /* overflow: hidden; */
  /* text-overflow: ; */
  /* margin-left: 2rem; */
  /* width: 100%; */
`

const Spent = ({ title, x }) =>
  <span title={title} role="img" aria-label={title} style={{ 'margin-bottom': '-0.2rem' }}>{x}</span>

const Inputs = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.1rem;
`

const AmtAndIo = styled.div`
  display: flex;
  align-items: flex-end;
`;

// spent !== undefined and inputs > 0 are mutually exclusive
export const TxItem = ({ address, value, txt, size, spent, inputs, myAddr }) => {
  let addr = myAddr === address
    ? <ScriptHashCont>This address</ScriptHashCont>
    : <AddrLink to={`/address/${address}`}>{address}</AddrLink>
  if (/^script:ajAJ\+REC/.test(address) && value === '0') {
    return <ItemCont>
      <span><Help.PacketCryptCommitment>PacketCrypt</Help.PacketCryptCommitment> Commitment</span>
    </ItemCont>
  } else if (/^script:aiSqI/.test(address) && value === '0') {
    return <ItemCont>
      <span><Help.SegwitCommitment>Segwit</Help.SegwitCommitment> Commitment</span>
    </ItemCont>
  } else if (/^script:/.test(address)) {
    addr = <ScriptHashCont>
      Custom script: {Buffer.from(address.slice(7), 'base64').toString('hex')}
    </ScriptHashCont>
  }
  return (
    <ItemCont>
      {txt || <>
        {addr}
        <AmtAndIo>
          <Amount>
            <Pkt amt={value} />
          </Amount>
          {typeof (spent) === 'boolean' &&
            (spent
              ? <Spent title="This output has been spent" x="🔸"/>
              : <Spent title="This output has not yet been spent" x="🔹"/>
            )
          }
          {inputs > 0 && <Inputs
            title={`Transaction was funded by spending ${inputs} separate payments to this address`}
          >
              ({inputs})
          </Inputs>
          }
        </AmtAndIo>
      </>
      }
    </ItemCont>
  )
}

TxItem.propTypes = {
  address: PropTypes.string,
  value: PropTypes.string,
  txt: PropTypes.string,
  size: PropTypes.number,
  unspent: PropTypes.bool,
  myAddr: PropTypes.string.isRequired
}
