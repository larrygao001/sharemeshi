const assert = require('assert');
const bitcoin = require('bitcoinjs-lib');
const prova = require('../index');
const should = require('should');

describe('HDNode', function() {
  describe('Fast Derivation', function() {
    it('should attempt a fast derivation', function() {
      const hdNode = prova.HDNode.fromBase58('xpub661MyMwAqRbcFfMYQX9xJftaf9oLChq7unXqHAN2CKYs7CTJo4XUohysxtFJEtcQkbmNSJHpEEJakPSQyYAC6YU6J1ReQTQDKtBoDX3uWvV', prova.networks.rmg);
      const hdPath = hdNode.hdPath();
      assert.strictEqual(hdPath.derive('/0/0/255')
      .toBase58(), 'xpub6D1hyX7z75XLSbJYqSTbQH7W9V1kF3myQeND1ARmW6gNRnchvNzBTib9CKjXpUj8QXmYbUkkNRuhjkmAiCEkKrQEN7qQwwG3HAfd6dovakF');
      assert.strictEqual(hdPath.derive('/0/255/1')
      .toBase58(), 'xpub6BgUwTiRLgZkJqr6i3qoWjcT9SJF1CwCap5Zkbn3CRPsqJaAZdbcn1Cf2LgxfFnpHKJuDecHg6SHDrUKNT3pnQbviZ9x7R3JfbUjcedEDWQ');
      hdPath.derive('/0/0/0').toBase58().should
      .equal('xpub6D1hyX7z75X9DNYWCbs3Fzfgm7s3aWiJuc3rbwcCrZA8ph7GwqJSrj4eaVzYrCPkTTyf1ZqTLGu9kvdUNBor3bm3CsFCxtYddy7ex2bLBZA');
      hdPath.derive('/0/0/1').toBase58().should
      .equal('xpub6D1hyX7z75X9HGxv53jBCdzFEVvk9uRjeh3WSHG37R136tMu9dyWb7KJCFt72iYSCTrmD4yTtEE7MNhSnYjmmbUT4bJju4cbGn1PTtSYZGt');
      hdPath.derive('/0/0/255').toBase58().should
      .equal('xpub6D1hyX7z75XLSbJYqSTbQH7W9V1kF3myQeND1ARmW6gNRnchvNzBTib9CKjXpUj8QXmYbUkkNRuhjkmAiCEkKrQEN7qQwwG3HAfd6dovakF');
      hdPath.derive('/0/0/4096').toBase58().should
      .equal('xpub6D1hyX7z75aFDdEt428r76bNRQdnN9pJ3xGcoJdizwB6owrkq4NfyBvaLq8sieUjNgsfrRjN2i7UJF3JJ2mLRSLHyq5KWgqvJzP4zkpDbNM');
      hdPath.derive('/0/0/1230141').toBase58().should
      .equal('xpub6D1hyX7z7MbAP95ztecu6kcubersHfgPtzSHDwuGmXBa3sMXM1nAHAWMiGV1j9nguzATh5EnZGCKrzU2k1jH8VbcamaV4fcqHiFzwYGiL5Y');
      hdPath.derive('/0/1/0').toBase58().should
      .equal('xpub6Crjp1U7vn1CLiFvQVKqJR3xrXZeGQbBwL2KpEchNAsFB327bDTmFCLz5yNrxuebuSzvgzBTgsLE8WWeBxGkv2VfVGw3G4kQseU6USNygWA');
      hdPath.derive('/0/1/1').toBase58().should
      .equal('xpub6Crjp1U7vn1CPqRiH9Ho9mRSfhaMJAvmUCha1AaR8H8X7vdCbBxjfC66PCQUcWGpk3nnLEHP6Ua659GzKousdT3ow7XLHdZN7tgGrpuDGXo');
      hdPath.derive('/0/1/255').toBase58().should
      .equal('xpub6Crjp1U7vn1PaBgJeHG63cW1XusyVAFQFBZCVEaot635HA42W18rvJ9jRrCjtpRFJnj2KgpuvNCdGExKao75yxi6NXSwG5aKosprAXreU6C');
      hdPath.derive('/0/1/4096').toBase58().should
      .equal('xpub6Crjp1U7vn4JM2Q84erwigKpD1EN1juBZrQyrySTyhVk4CZ5fWFFxWG1fgeX9v7ZfGwDRtC54jdF91QAMYwBDoQZvxqsyv7iGiJNkr2xGnT');
      hdPath.derive('/0/1/1230141').toBase58().should
      .equal('xpub6Crjp1U7w45DVEy2tsftDfVCQ4DkCxzgw1ZiNEZZ1qov2pt3K5t3UWwag6gFfgLBdAGcj8e6sXXN478xwP7NY6d4bRDur79hFij9muBWd8j');
      hdPath.derive('/0/255/0').toBase58().should
      .equal('xpub6BgUwTiRLgZkHMLvyfZ7ZhsmDMYv8LhwGAQUsKgADHnLeBEih6JMR7JiRPrfmVLVj6nM7DsPmVx6k6Vn14aUG6snFBhP1xG2ryi9dqJphrz');
      hdPath.derive('/0/255/1').toBase58().should
      .equal('xpub6BgUwTiRLgZkJqr6i3qoWjcT9SJF1CwCap5Zkbn3CRPsqJaAZdbcn1Cf2LgxfFnpHKJuDecHg6SHDrUKNT3pnQbviZ9x7R3JfbUjcedEDWQ');
      hdPath.derive('/0/255/255').toBase58().should
      .equal('xpub6BgUwTiRLgZwWMCG4dGwHcdJW9yJbGooRyiXaj9bsjjcbznSwkHki3jwUW8Wp1Mqsmv2ibCugQ8JHJSJDkVPo4jdF5eJ6jBdh7Pdo2ddmag');
      hdPath.derive('/0/255/4096').toBase58().should
      .equal('xpub6BgUwTiRLgcrG7zVSGD6agYxnj5UxR9nvJ2xiEVxt9MHJZPsuMj6Tgubwpjq5cEGgJtM8FCSJFrsk9o6MaxGo5kC6PStvsnusM6R7Wr33U6');
      hdPath.derive('/0/255/1230141').toBase58().should
      .equal('xpub6BgUwTiRLxdmRCfSjY6JVkdQiKR4HN8F3XmhYHkDcmyX3d7CCo7AbpxqkgFagz5nGUikj8NCvJ7Djnnhz17F66W5pT1REbwcMeHyKEu3DRj');
      hdPath.derive('/0/4096/0').toBase58().should
      .equal('xpub6D7Z1idW87DAkqqNri1qVXQvi8NpMEkmMX3poFXpDBJaVZNmfqBACFLagueNLzWFUivGupRim1xTEN21T1ZE7kCLqUzXHdF2kvrh7GWsHPf');
      hdPath.derive('/0/4096/1').toBase58().should
      .equal('xpub6D7Z1idW87DAoAsHNoZnXnE5YEchPdSt7wg1MtSmw6apuqYemmUECgikF3CK5GdgDZZaeTCy6V9WVs9vFXEDpz7VBiPvamVjz2xk1TmoXez');
      hdPath.derive('/0/4096/255').toBase58().should
      .equal('xpub6D7Z1idW87DMzXCtFaNvQyeVMTQ9KQg8tny5JY6qmJ1imS8B5q3uS8FNfPoSSuCNm41StddGeKZAwRzD52YpbC6iza8VMbk7TDLDqKhci1z');
      hdPath.derive('/0/4096/4096').toBase58().should
      .equal('xpub6D7Z1idW87GGnLfHK57TfUdk4TbAdtoTxXtoDHvumsZo1tkMawHgtdaLAojiGQ2id44kMxFMg1vZToLDPU2gNAGFAfe4vZupdkPd9hwRCuj');
      hdPath.derive('/0/4096/1230141').toBase58().should
      .equal('xpub6D7Z1idW8PHBvYtKJjJEAkG7RLP5zdCwRMH8qbRKZUmENS5M4UX3tg84sM1Vjst7zUceDR5tc9ZR6SmLV4BG1bquBe6J7htnZG2ZFUhpzEK');
      hdPath.derive('/0/1230141/0').toBase58().should
      .equal('xpub6Cz1gPCsrzEKi4m4nSNidEzJu7Ce177hvYErZBUfb9phaSxax5ZvwWwkWBDx89zUHG2vPJJxPCWF4Df6k6Jtzfb7kVBdjMkAyN56VC3mz9g');
      hdPath.derive('/0/1230141/1').toBase58().should
      .equal('xpub6Cz1gPCsrzEKm96A2QWnoYQt6FDwbSqFzEgBqJeFMwNzxZizSK7vb7cuPsd9mSWcUuDGyByZWLz3PA5nx9eBWGHDVwtttS9S63mYBxRU7mZ');
      hdPath.derive('/0/1230141/255').toBase58().should
      .equal('xpub6Cz1gPCsrzEWuQypGe6itbmSMmmK748Q4YxQomctF5DaS2S9MACbKYo1XpHD4P63umaEStLRCJPN8bjLnWDLSPsP13aSYj4Yt8tngpQgwQZ');
      hdPath.derive('/0/1230141/4096').toBase58().should
      .equal('xpub6Cz1gPCsrzHRgWhBdbcdbfCvtYeWA2tcHJ3cfgNWU14CEVeXCgLd2dvzaJozh7m1nTCieYgf3GZzwVht5dQuxKi1p68Z2GizLhQ4S2aPpwR');
      hdPath.derive('/0/1230141/1230141').toBase58().should
      .equal('xpub6Cz1gPCssGJLrk5T5ndAMbbEDhAgbRT8MqRdxvZ8j34PdQq8dWE8G2L2PXWa76XYGDEYcsoRvsRZFJpA98AJKSzvrYmFhjz7UecF8PHBrcw');
      hdPath.derive('/1/0/0').toBase58().should
      .equal('xpub6Bz9Giq6cuEX74N44Ca4qrvKYYeWH7dvmEsipqvrJ31aFdjdKgyN5F8bKJqyRRKLGDB9wwufmiej7YwoGk89buqfiHoiTcpQvGaz35J1hen');
      hdPath.derive('/1/0/1').toBase58().should
      .equal('xpub6Bz9Giq6cuEX9Fq5ZUMyxW4XxjtEGTNbnUVJZuxcZAcmkkj8FFAXQJY5HpT3WqCDPc9ENQ7AE5kGBoHSYMo4x1urdhGvUrWUxfqx6PgnTWy');
      hdPath.derive('/1/0/255').toBase58().should
      .equal('xpub6Bz9Giq6cuEiJp8NknhguwYhsvg7AwzK1A5Z1WVUZNdYaLXRH1ZZ9gDWLeTmsutg95UfkpMvs91D88boFr8GGFVHa65dPDKNJgvMWQWZ56k');
      hdPath.derive('/1/0/4096').toBase58().should
      .equal('xpub6Bz9Giq6cuHd7Q71okVkvfGR82tHeH44ksi4HaX4UwoKeEQ3gHpE6A7AfyhvLorNnjUBJfia5XtzUu9JvT6kqHS3twL8587aNAZt5smx4Q1');
      hdPath.derive('/1/0/1230141').toBase58().should
      .equal('xpub6Bz9Giq6dBJYEgKHysYTS1KKRUphwULK9Mu6bjykRpy51siGRsJX2geufzRs1kyGGgAijZCescN8FXVUs4g2iQW3rmuFnXukHSBvqWe15bg');
      hdPath.derive('/1/1/0').toBase58().should
      .equal('xpub6BxxfpDnRmdXLAjXpkrvMUi827bFwpofazQ6NgWP1jyt7RWQNa29VDUnygoWzRufkbpj76GrkBwWkZ3CyxFL6yZyp5hDHbNY5ep9nWcwQF7');
      hdPath.derive('/1/1/1').toBase58().should
      .equal('xpub6BxxfpDnRmdXMN1vSCXA4GxRexCz8mazVRXRGEZQr61cZn4feh2XQg1MtP4RNPWHNkFWLacqGUvnTd7892KYenRqc65p3PXmrFz2ogGetEP');
      hdPath.derive('/1/1/255').toBase58().should
      .equal('xpub6BxxfpDnRmdiWqT5TaMnMa2aAGnQR34KFm3cFS2ijEGfsefY1cbueSmmKemvA59i2xhpDrJheXixsB2qtJN8MNMp4rM6UnD2mhqzbU7hN9N');
      hdPath.derive('/1/1/4096').toBase58().should
      .equal('xpub6BxxfpDnRmgdJHe42MWDm35E1cSHes2LmAsQxwsjy6GpHYcwAzvtEPLUCShDtVeMAR21cJ4qKjASXhnCopRj6tnpx7SjmiKnV4GfanStNB3');
      hdPath.derive('/1/1/1230141').toBase58().should
      .equal('xpub6BxxfpDnS3hYUwtnHjmLFvaKqndbCAkesGkqdWvRhvU3jA5YzeyZt7eRKpWvaEdxWEr9YF2LWa7ZEfEV3Uy8SNF4EPi5nrCwEnX6T7pLMcG');
      hdPath.derive('/1/255/0').toBase58().should
      .equal('xpub6DJ3HALex8wZom3f1JqswQqK631XQD7TQBU9UZhigeJ5WBbqLaxoPMRteCAQQZ8Ff4qs4e5RaNzGucvLP3yQYjnfYWAzme4hbf3k58GR5e7');
      hdPath.derive('/1/255/1').toBase58().should
      .equal('xpub6DJ3HALex8wZp1U3CpSBJCXzuxRQDPVY9rT9ND6sj4UsxMZypHaC65oTC8AQ5RTeEk4xwfKjJ9yDrviyEUVdTVr2Ai8HvA7QiAoPerKfvR1');
      hdPath.derive('/1/255/255').toBase58().should
      .equal('xpub6DJ3HALex8wm1R9PFqwGjo5cqFLKMw4Djxfh9ivY3c4Lyv6FFnmCqF6pXT1qDS6YocMJeS6bq3VU6us4BLRQrTKjjbGcU9ANZnTzQuvw78C');
      hdPath.derive('/1/255/4096').toBase58().should
      .equal('xpub6DJ3HALex8zfmkwzuCNaoB2RRYJC1gF8fjS7rFiYViHy8o7Mnb6G5ncTtry4hudrxBL51Y4HC9mkzJje2Ad86QrBVijTV71eMWDjJ9RVte7');
      hdPath.derive('/1/255/1230141').toBase58().should
      .equal('xpub6DJ3HALexR1awmsgV934VHGSFUEQY2FxDb1ANoVvmdvoCMXDBR5Bu8h3g7ZKdMivGcByCp5hpFnZB3vxQcbzSnjHjvDfayP6roewrSE5dBj');
      hdPath.derive('/1/4096/0').toBase58().should
      .equal('xpub6Cfht8jadjMusV6vEmhWU67mKnBU58oCDQfXPyGB64dPoBrMeHv3TxMS2epH1WAGEeBexA2GDPsVhkgvrTVY9iob8m3rha8fvbSPu4FHh5d');
      hdPath.derive('/1/4096/1').toBase58().should
      .equal('xpub6Cfht8jadjMutXZPDRaBLq8CfY6RWDz9KQyrQoQqTN4wMRVa3S29GHsQtFGxNyebmiebYSeoYFN4KhyqB4X3VBWoWzMrQkjbXFCXRMfMeTs');
      hdPath.derive('/1/4096/255').toBase58().should
      .equal('xpub6Cfht8jadjN74Mqz4NfgPSnFkHy7Bf9nQazYZM5C56Tw6voywopp4sWZhoa7tffWtNVMJ1FdtV6RycNNndHVVaqPvqK8WncorbEHRNUj5eM');
      hdPath.derive('/1/4096/4096').toBase58().should
      .equal('xpub6Cfht8jadjR1sext2c5FdCVpeMZeN66hLLKxU29LS7LEtaChw5NcjoBHLoN9sDVHPTprW9Lj4m3tS4msTYMzPZmFSYmFcK1m2cFMxz7i99a');
      hdPath.derive('/1/4096/1230141').toBase58().should
      .equal('xpub6Cfht8jae1Rw2LqsXJcApAvnSR6Ky7n9tczS5hQb4bpiGcffvJpjwHbGXDqM3V13rAs84jKX8rAMp1D4xezSfib41LyeuGhqL8dK8UzJVKY');
      hdPath.derive('/1/1230141/0').toBase58().should
      .equal('xpub6DBcxyRPa4rH7rKEugh3gzJsXA3wFnGXhC5u4i8ReXLawVLY1JuYPgUBfm4pNH7LmB9JDDWpJ6bFGDoCWriEtosCo4bk3tv9uBV44Z7ssVe');
      hdPath.derive('/1/1230141/1').toBase58().should
      .equal('xpub6DBcxyRPa4rH9Tt88DFvPJ6xAF8a2EXVBmWmeUC3AWYN8ZGyobmMVRgxiAYXNPDHNVzkxyVYji3JRi5GBrQjKsjKv2ZP2fLFv4MnY3KwXZf');
      hdPath.derive('/1/1230141/255').toBase58().should
      .equal('xpub6DBcxyRPa4rUKJgcYriX9e71XG1KvMjeLfqdYkTu89N3b9eYANPoGczUtD6YBYW5osNxQ5yJFeEdBTCFcih9bU4TiAuPHVHX9DMwPzor6Wg');
      hdPath.derive('/1/1230141/4096').toBase58().should
      .equal('xpub6DBcxyRPa4uP7eKrXybbchvzRwWvmXkZTW1ZxDKLyrQrNc3a6jTuyh44oZURbGo4vFGmMfYEVqiob6oNCMbbimVzH2ZdVNHBfgKar6JsUvC');
      hdPath.derive('/1/1230141/1230141').toBase58().should
      .equal('xpub6DBcxyRPaLvJFV7eVaZ3fezVEPe3Xtq6r2WgngqFG11GxB6chK5XADAPL8EX7Z1454UUGGd8mF8mUZoqpusHCGEN1bVH8j6mQEVS92p5Fou');
      hdPath.derive('/255/0/0').toBase58().should
      .equal('xpub6CZdxrC1kbn53PPBdeopr7fTacXHMhRqLqehBFWD8HHf4dmdbzJMY78QM1Rsau2qzo6EJjGAqVTN4bGGD7aE23FveCfUPUNKs2xr6V5GdjZ');
      hdPath.derive('/255/0/1').toBase58().should
      .equal('xpub6CZdxrC1kbn54nJfYSViXCMbDZF5fsXt7bJLnVrnQMftpHaEHwtpAvkT9jVcbJ3pY6AmbqPCgDmw2rVrhwZQiuenW4jtxe7nibEBj1diVSz');
      hdPath.derive('/255/0/255').toBase58().should
      .equal('xpub6CZdxrC1kbnGDubzZhTXd5wDVM4HnJdXYXV91b7RbkxgmnDRwhkvExrHhpQ8fFyQrwHUu27j353DyWGcgiQPScqPjKFWJyd6BJXWYiiYxne');
      hdPath.derive('/255/0/4096').toBase58().should
      .equal('xpub6CZdxrC1kbqB1qVHdDiJvnQ1dN4xeCci111veAVtG1F73JH6CEPRTyD5nwaJzh5wrM72ZtQ4wTAjya3Qd2y8LkD3px3jBKsurZ7kPvuw8fG');
      hdPath.derive('/255/0/1230141').toBase58().should
      .equal('xpub6CZdxrC1ksr6BEts1YaxRRqPwq8N3VFrWCv3GnzrnjaG4fPeRSev2rUBjgokETcCyqrFPbxLwv7qA62yYuL3UgcCCE9n35hXxYSDwv7dAXx');
      hdPath.derive('/255/1/0').toBase58().should
      .equal('xpub6DFeJM57LkgHPtCnBaoCgB4Zm3BWW8Qapoy7sDQtfEyumi3zXtKQsL6NvbiJaqmYYXGP9Ytz1HaxV9Jsr3RsZmC8SWMuinKS2RDZk72kz6G');
      hdPath.derive('/255/1/1').toBase58().should
      .equal('xpub6DFeJM57LkgHUBZEiNAYibHdGycXjYShBR3q9opk7NF5q6Cn8pvbMLviV46TkxsWNLBhGSqdQTHmZEGdh1acu9kdx2YPD3EvRZgoW8zRKT8');
      hdPath.derive('/255/1/255').toBase58().should
      .equal('xpub6DFeJM57LkgUdFvkWTpt1dW6Bko3T2mU4gcFJh14dfd9UAhG1UbHucmj5LmRVEkorB9eWCJu48we91QqCKd3BQAixQ28QMU8Eebxh8gZRvW');
      hdPath.derive('/255/1/4096').toBase58().should
      .equal('xpub6DFeJM57LkjPRDwKJaotPywcxwVRKxJn29Eys6hKuZxEfBqvHHJZpYahfuDTBPrmZBmrYRW7bSxtWkGvAxYet83UyVC8PUHCh1NHjm46aPR');
      hdPath.derive('/255/1/1230141').toBase58().should
      .equal('xpub6DFeJM57M2kJaX6xQwr1q6LHS5cUPKo5K5qbAgeTHwTxoXVzyhTAEsXCfJB91oydXuTNCcL7ewEyKkwBeEkXyBJW6YuzaHsrxv4aXWu33az');
      hdPath.derive('/255/255/0').toBase58().should
      .equal('xpub6BjRARa7AbbWvx7crQYgv7FpJxS7j99gk1vjpqaqXCkw82FMokcz9kcf62hRRveHtUoqaYi4sB3Bsc67wZtR83bLSEm9qm4xt24btdd8jeT');
      hdPath.derive('/255/255/1').toBase58().should
      .equal('xpub6BjRARa7AbbWytjFqeigFku9WRtFuhA4BdxJWtQC6xcSSVtxx6adskz8ytJ7ZBNdXw8AGAtKxhAUAqjDKHb4Mwoyy2ProoUoAhDmUcbJp7n');
      hdPath.derive('/255/255/255').toBase58().should
      .equal('xpub6BjRARa7Abbi9dWFZDXpybxGUCkJLMCUMzUpKxRiXzFgdtYcGQ1uYKh9JiK8x8vRgffB94ve6v8jmQwAZn86xmWaA4PPgt1qkPJtdkqa3vS');
      hdPath.derive('/255/255/4096').toBase58().should
      .equal('xpub6BjRARa7AbecvJdQXxWynpd9mAheZPBww86VuaPLLb2oMfCZkKhGnvy3aGJS2LvbSPcwMNZG6JNriEemtiChK3kU1R6sR9wTKfuf4r7rfjJ');
      hdPath.derive('/255/255/1230141').toBase58().should
      .equal('xpub6BjRARa7AsfY6EQyVfY3gJd4zRqjWjyGSbyLw8yFxRXdz3Qb2KQ6ZkuuL5nR3C8A1LwRypftkxXR83MwSmMtwMtHTvkaqBL9bvHziiivBoX');
      hdPath.derive('/255/4096/0').toBase58().should
      .equal('xpub6CttMn1EHPEcFLMzTg4NuPQnv3wWAj5RuEzgT1miXCKmaL15H1ZwVYi1Lh3tDFi17Q869a7epYZSXyiyrhiTuSFWw7AmnECtbxkLqNYpxXk');
      hdPath.derive('/255/4096/1').toBase58().should
      .equal('xpub6CttMn1EHPEcJyFFZ9rWwv7fch31dytiSd7dsqgFGLm3VTMbESt7ugc6pK3ynL5QRkFcnjeGb5GsTHwgPHVbStLfTZbYPiuaL7JruUe5QXQ');
      hdPath.derive('/255/4096/255').toBase58().should
      .equal('xpub6CttMn1EHPEoUD5t9S6wh93hwyEqw3YZGYXD2WFUn5xTvtG5rkKg74572o2tv8yRX3SULcA5QVTHAtNjTFeayNBp5tdi57mEJ5fPtEjusQu');
      hdPath.derive('/255/4096/4096').toBase58().should
      .equal('xpub6CttMn1EHPHiEmxNCY9t48WAnjjHmExTYvQkZr1L4PWJ7QtmzmusjqopPgqqNAghXdbtNuosSJQj3y4Y77C4pjuB98S8k1MdUfo2PEcn1X9');
      hdPath.derive('/255/4096/1230141').toBase58().should
      .equal('xpub6CttMn1EHfJdQmRYqvv1KoshrhSnVAqAvMHPySFz2tDzk6e9DzeZgig7LwsH3sYFv9nYWFdqgnNkSykSGqPKCXgVHyd18N5mo7Ukaatns3A');
      hdPath.derive('/255/1230141/0').toBase58().should
      .equal('xpub6D3suwiULXDw5z6YRnqXS6z8JMPqBvxvNWRLUSszgYJJMtt6rFFVZ6wi9Fy2VuxknXomJg2V6Z2LVmrTcnNV3dGFYEZvo3cMGmPxGTixEsn');
      hdPath.derive('/255/1230141/1').toBase58().should
      .equal('xpub6D3suwiULXDw8GbyjZ4UcZg48M8cuB5tTqF7SuM9mpHTLNdKMyjTVnDpdXiAaHWGDxdrg8Y6wkNY9KmhSfHAftx9kpYHu1TZKSRUmwpCsoL');
      hdPath.derive('/255/1230141/255').toBase58().should
      .equal('xpub6D3suwiULXE8HXk7RXzkYB9pwkKdzGCD47v8FhtzsHAUtN1SYvLXKS4kcatiaq2dtg3SdWRyMCMVyQMF1wPmVXRJCfgue6C3EXxxjMN4s15');
      hdPath.derive('/255/1230141/4096').toBase58().should
      .equal('xpub6D3suwiULXH35TdkZcfvWwB8auwV9Kj1Xw3JvCCQhb2bAGL6G4YKyUMHJe9saK13LZPXDvwFKWGJifpwJRgXsiuLyk2b2LfUQN7TRkUXXgr');
      hdPath.derive('/255/1230141/1230141').toBase58().should
      .equal('xpub6D3suwiULoHxE4kJbjQybTgXmUez72yH6KZ8kWdHRF43xDNnVZphJZ2ypbu6rnMoqziNdZ38YDKZhAaWjMhdwjRMUdkYqnMB5GubCjf1CAa');
      hdPath.derive('/4096/0/0').toBase58().should
      .equal('xpub6CUUGN6KMF7wcUetsypRhCzbitDpxUsH4PKyWq853U4HXuTMMaN1ek3Z33UFNu4j3c8ECNKh4zJMe7rXdux4dXbxiNDUbtrT8gLmDnKomPM');
      hdPath.derive('/4096/0/1').toBase58().should
      .equal('xpub6CUUGN6KMF7weiVAqjM5dvmZf5FQeNqZhS8AgyyjgBZqkEpYdUpd8PMy3EzKrVgZA4VMLZioHvrAhj5a3oLXS3HN4RLHinahWMkJgSKv9mb');
      hdPath.derive('/4096/0/255').toBase58().should
      .equal('xpub6CUUGN6KMF88oQCKTARA7ENH8McSeqQ59yMQrkmEnf3RmAMuUBaD3fW1SouuzCN2acmadiWYknsjWnGx1TV3UYqLdvLKvHMNAiGfdoyrEAN');
      hdPath.derive('/4096/0/4096').toBase58().should
      .equal('xpub6CUUGN6KMFB3aABGWJymRngvEnKu25d4G29ztEqtP8CK5PTHZ74L1H6am9nDoSmWf2dTd6h5TxmeW9vdD8w8fjeCgT7JfnpQFSzgKoU9Y1K');
      hdPath.derive('/4096/0/1230141').toBase58().should
      .equal('xpub6CUUGN6KMXBxk9cc7h4KkeFXNyWQn9vGigv5Z7hF2vzsU5aAFiTraJCduxU3sRjs2iw6xMDAERyR3FRjRQVnf92E1igcwRVM3qfsaW2LnNV');
      hdPath.derive('/4096/1/0').toBase58().should
      .equal('xpub6CpgKv6Kgryw2MX7hHg2eQJsyQP8KzVtUMsAHsYHAbtomLFG2J1WQJS298Aj5X1pezctco1VaSTt5y9waCwrDtAJrD6jiwGeAcE7jntM2qn');
      hdPath.derive('/4096/1/1').toBase58().should
      .equal('xpub6CpgKv6Kgryw4JjmQ1M6FcpgQjWxG277NVJiFQGtTigXpFLx3Qaa8VZB5BETARWuxhokYdzbfXcvV26zZwmS8fs7HUb5t4YeUwr3QGnVqCF');
      hdPath.derive('/4096/1/255').toBase58().should
      .equal('xpub6CpgKv6Kgrz8FPJTGZtJJ1t33JMM9V3DAb33M8wCErNVKFo6wtPyPVtiz2V8P3b9eeH65hq76xeqp7YEqfvb25u4CCeeuBzT9DdkGbhE4L5');
      hdPath.derive('/4096/1/4096').toBase58().should
      .equal('xpub6CpgKv6Kgs332zMTwm9D1uQ3w2hnQS686AvfvAeG6DwL1r2VQVj797gXFkZhRYt4g3789wecmuHNcqtaZabUBidbbZjotUYtBTtvmyGBCAf');
      hdPath.derive('/4096/1/1230141').toBase58().should
      .equal('xpub6CpgKv6Kh93xB97k2NJYC2Z6FuR8BZ9kpViMuYC9Ao3rUhcQ2geYRccPTTpNFFemTFTziS8Jz9u6z6ojspWw9aRkBt2FEekAMunCubMYi7d');
      hdPath.derive('/4096/255/0').toBase58().should
      .equal('xpub6DAMT1raK9mkBtCAoUgkyQNcdNQVqwzNxJFSjWWwkXzEr7tRKna7FLZxHVAZzmupNxsYkyyBHGfb9SKwxzTp7ttZARUGdTaxazUoNezbGw5');
      hdPath.derive('/4096/255/1').toBase58().should
      .equal('xpub6DAMT1raK9mkFH2CJ6pz1AyMQU3kpzanuydD1WiYK19E2r1PXMQxKoHRRwh9WhZ8bJN4rVGUxdLNWyhDFbs8x9k7rVwZEX4To4f6pX6X4Ws');
      hdPath.derive('/4096/255/255').toBase58().should
      .equal('xpub6DAMT1raK9mwPGNaxyo3B99s2P4TxwEWevRSByHEnVEAeFqSSfvNZwh55sKKBBU4GMnGFVmg4ZzR3T1gt7Z2fNGwgwS4soVUNcn56VNNbCu');
      hdPath.derive('/4096/255/4096').toBase58().should
      .equal('xpub6DAMT1raK9prApDn4TUieAhuxEcx7KvM4a83XXS7MHpMDyZwVQyUyJ4xnGdmbScen6Tv8xgYk88LABRRYcZkyNPXPYN6UxZVJDoFnjoCy3E');
      hdPath.derive('/4096/255/1230141').toBase58().should
      .equal('xpub6DAMT1raKRqmKqzHta8CdxQ6jy8MSzuNgQHo5dPJfdDLNY1RHAVMjSDsi5PsfkJGHCYsyPNoBJZXu4kPAKnhcxzvK4RFUArUxZQMW4TswZr');
      hdPath.derive('/4096/4096/0').toBase58().should
      .equal('xpub6Cng7eg7qE8eq7ho6Wjt2N5CYN9rFsmKQmXFRvsYCWYy4XKv6AhoVeoqvPk4H2jZFDg9dTPZe9MVegk53VLonGFDWt78zUFEQsYXgSyZikW');
      hdPath.derive('/4096/4096/1').toBase58().should
      .equal('xpub6Cng7eg7qE8esYUu5MANt1Zd277sad2Cst1JhrQ5PzCCSDFYacrLqUutFQUXMdr8HYuxGiiMno81t4zih9mjTcYsf8ZvmgDFqk7qPpyb5Zq');
      hdPath.derive('/4096/4096/255').toBase58().should
      .equal('xpub6Cng7eg7qE8r2BEYuuRYqnxRQuvLH7D9Assogq5KtHbY3Jah82WketSXfSthvJiqkFxqD23YYXsqi61MGmdXmLNT96yY9v1kqbRN4grf9Wv');
      hdPath.derive('/4096/4096/4096').toBase58().should
      .equal('xpub6Cng7eg7qEBkpcgDnak2w98DkutXu3WCshZh5pKt5zv4dSNrsiZchETFBpf2LzXYgY4WSG212Hh5QcFaYm2o5jegEcv5ujH4qeh2GGeHDZR');
      hdPath.derive('/4096/4096/1230141').toBase58().should
      .equal('xpub6Cng7eg7qWCfyK7QL6ZB5uHtZXHogVdWnfv5WapkQeZQsbE11mryTsgRKJSQiPiG8skKwbyAw3He3anhkAgLygq5bJ6ycQ1DWckADVih3cD');
      hdPath.derive('/4096/1230141/0').toBase58().should
      .equal('xpub6C2Cm7DVMnA8kGqxUBaaP3bYEMwaPJtuwziit3BdhaaqnJMS9QbD1t17y7XULgX4XFcgGnWA9onWDdms2S96q8HSBJ17P4TCcahE9Fnbb6o');
      hdPath.derive('/4096/1230141/1').toBase58().should
      .equal('xpub6C2Cm7DVMnA8n1pi861ESQYNz2aGCPQBQWmMVK42ytKTBSaNKKyYWZ8RqUn7po4CP7jSURCukACnVAPT6VtsUYfcCqk4e4a8YNLcY39WV1n');
      hdPath.derive('/4096/1230141/255').toBase58().should
      .equal('xpub6C2Cm7DVMnAKy3Z7PtmtLKy1FY66zD4i6XV8iWEAv7YzDEnRPR22QmQKZN7YCtJjPJ3x1MJpEKpNuuHyNKBFUwAtobeDjU5zoJCN7Fck4tb');
      hdPath.derive('/4096/1230141/4096').toBase58().should
      .equal('xpub6C2Cm7DVMnDEmUEG2884Xj9XYgRtB8hGXWuhgLFoPueGaUCKiiijWThodgdZwzMdvRFYns2QtuAtyHEHFKxJ8gMA7c67GRPDWPQRDBDqWe5');
      hdPath.derive('/4096/1230141/1230141').toBase58().should
      .equal('xpub6C2Cm7DVN4E9sxgnN9ReVEMFJwhr8mcJMNQxQfbBVjjXbrrazKsRuuqbCmxNmxLxjRrMnMyfnAKjZ1tAKispKWReKvFgwrAP1YAqEZkrAA1');
      hdPath.derive('/1230141/0/0').toBase58().should
      .equal('xpub6DJUKjodfWbHEoKEozGkkwHxzS9r8dcjaVemfRuYruPPE87F68GBz7ET2tZgVCQNG2NDQzSs8sq6mtazuCCkBNFqFaz72hxqMUdBMWnDUoQ');
      hdPath.derive('/1230141/0/1').toBase58().should
      .equal('xpub6DJUKjodfWbHJM8tFGzKqkNvTBC1MiYxc5EnakbfsabGaou8fBYCSKQKYTZ4uN5ShHL67RFBkwy7uRM6DChJgzvLbEeUZd7RJpf4Qbkwpnk');
      hdPath.derive('/1230141/0/255').toBase58().should
      .equal('xpub6DJUKjodfWbUT9tAL9NC1kWiN8PYMz7dcoX5T3NNfR2UdAqKmjCKE7ZcmmYygQcxWVMaZquJ5UGai1xtT5poEog6GwDop4KyY3QwxNbtCmq');
      hdPath.derive('/1230141/0/4096').toBase58().should
      .equal('xpub6DJUKjodfWePGPoyLwmSk2p4GHSvVjgeMFm7ApiXy5VemixeFLWkB4bZ4b7RKpTqoHiKEn13H18dvoqW5843pUSgNYdhLxnRwcobwp5SEGF');
      hdPath.derive('/1230141/0/1230141').toBase58().should
      .equal('xpub6DJUKjodfnfJRB2qziizueikEFymbY1Sw7AEJeH71Nr9uS2hpizjs9ExQJamsZdhXkfmJW7GixHB6J5iuX2PYmX6krmp9rsD6FfcY2a7AM8');
      hdPath.derive('/1230141/1/0').toBase58().should
      .equal('xpub6BimvD99rv4iKNtf6bRPsQm6iNhyC4kKfdLWQjosHrzZF7n2mdU14zGZHDfKNYpVPzyyCJXCdeEyhU6JUzaamdEH8Tk5kWMgkhjKMTXmAtg');
      hdPath.derive('/1230141/1/1').toBase58().should
      .equal('xpub6BimvD99rv4iME8TMLSBzZi2mzWNj8DqqN7qnVrQSGWjyBPN44Waf4r4dVD5n4gSCFJccmJ1YkVnHi6f5tSCyx7Up3rpxfZA5VSmXf1Hpxo');
      hdPath.derive('/1230141/1/255').toBase58().should
      .equal('xpub6BimvD99rv4uXHMR3jvNC18UfNSsNm7aNDNQcmpjNvcdFdc4ADhYBXUTKU2VvUEcDZTH93CJdYedK5zH7sJbsR2nzfHGhpF3pJFVmJ3AK2z');
      hdPath.derive('/1230141/1/4096').toBase58().should
      .equal('xpub6BimvD99rv7pKjzZneiKgh8CD8j7NgeGC6EmYFbCuvtDrx4nyA2QYfuNxAEKVJL4qJFY68Wj85VfqCrGxVoPbCdqLF9nJ9y6mDSFn1hGs2t');
      hdPath.derive('/1230141/1/1230141').toBase58().should
      .equal('xpub6BimvD99sC8jSestKjV96XazdvGXdCkPq446AgNCzCi4QeVbkLQRDQFV52vxuEJitnfwQw5rQz7KNHuyDuKHSatYDrKzVGE1cCZnvTWcDJS');
      hdPath.derive('/1230141/255/0').toBase58().should
      .equal('xpub6BxSb9kF7JVQcAaQKiNqAauUdRRzcdAT2wZUzbUBru6DTKmqr13z8r1uuqJymeMPbdgrcH9yqwkhiV8S9uMsJ982Zf7DD9BQD3CLQLHMKGF');
      hdPath.derive('/1230141/255/1').toBase58().should
      .equal('xpub6BxSb9kF7JVQf11ZMkmfUCDi3K8c6paTK17HTSgPgwzd71GdCiBuw1MxBvnXVjiAngVep4JbVgvXXrt8wqNM6RBzNn2h4kvBNU8meCZm2XA');
      hdPath.derive('/1230141/255/255').toBase58().should
      .equal('xpub6BxSb9kF7JVbp7xzkiL3xfNZC2TngoSHFJG5khBTgDZpoYUoTwqqiKMiMtB7UNWTCMALpDdD45fnC9MeHeBib9dYo9iwYEG16xGVxczwJZq');
      hdPath.derive('/1230141/255/4096').toBase58().should
      .equal('xpub6BxSb9kF7JYWazGiZ6YbLUndMeekiNec4SHm2HH5Kcvm3PBhNgrCyx8fFCmm3m9ZKYax7R1dtQxqiSaegX8D1Jaxq8vYSsT8eyYmsTYTsFT');
      hdPath.derive('/1230141/255/1230141').toBase58().should
      .equal('xpub6BxSb9kF7aZRjZsXrCcux289b4yQd7u277K9UTuwATFC1g9anKXPn22JatW5vDNHz5se7F6vd1Z9vnwLjaVyjVesC3BSFjW8M5xEEU45PE8');
      hdPath.derive('/1230141/4096/0').toBase58().should
      .equal('xpub6CuVrX297TJS1u3uo4fnGB6LeeCaxsR9bLkbhbEoZ8LQ9WmzGMiYQTNH7YVNJqwX4aze511T78hwsf5SNaqSXJP5GAgCa73Hj33eDvL2zqY');
      hdPath.derive('/1230141/4096/1').toBase58().should
      .equal('xpub6CuVrX297TJS3U4PHvtJUwX5bJFi8DV6GWfPcCCgdy2ZWKTYjfcAZbYofxxDpWyQbgBP8bPCB9dz4ejC593Dt4qwb9fTncaVUR8jSLD5zss');
      hdPath.derive('/1230141/4096/255').toBase58().should
      .equal('xpub6CuVrX297TJdEavHiTkEzz9djMcpg7rYvPLa6Cs4b8FLTvdrjMGGbD2uQeYaHwD9qa6oaGDnZZQRctfjCgySJdermAHAP83sniXrobEGxSZ');
      hdPath.derive('/1230141/4096/4096').toBase58().should
      .equal('xpub6CuVrX297TMY1ZVg5HVrZ3eW1KzkxZZsnA2MZ17s2Ty6UGftfRtuKQGA2dWDZHrbMJL5p8GV7MEFKxvZTJeawfvn3xwR2bSMp4hz31wQ19K');
      hdPath.derive('/1230141/4096/1230141').toBase58().should
      .equal('xpub6CuVrX297jNTAk8rT1BjXnXJUyKTX5x5mG9AnrQsR4bXzzbb55SuTwupEnDTfCHLyunT7h6xe4YUW4XKzc5tULkNb8zF5pHSQg8BD1Ew2J9');
      hdPath.derive('/1230141/1230141/0').toBase58().should
      .equal('xpub6Cgenu1h6wr44jjFyxMHzsChiLpHjexxNXHiYFtfTaVjXbTWrbWuhjvWRZxwReFaDcDoqqTdEFoaerWWGeep3t5MWDwhUL1qsWvqBQAW7i7');
      hdPath.derive('/1230141/1230141/1').toBase58().should
      .equal('xpub6Cgenu1h6wr463qYBDcA8kG1YUTvZmrrMqHmWbqXgwVjWBiHkp2Dd4iMKKN8gX5YagvBevoaxbsP4dhesdbedzfvHRYbfLmUJ5xyZv24P6J');
      hdPath.derive('/1230141/1230141/255').toBase58().should
      .equal('xpub6Cgenu1h6wrFFR4VUKYnJvGNQSfhE2SaEzxSwLwxZDYtZjVRq1wnoh4qj636Hr8uP4wHUKYBtszZkpzjEhPE3kvzR4vKjZJ1S6GY6NgSPWu');
      hdPath.derive('/1230141/1230141/4096').toBase58().should
      .equal('xpub6Cgenu1h6wuA2tBjvSX3U95ejVYwQTd6qypZiZUKZLsw8exMfVZwGWCVuqtEoMYdNFJd7QioYHbbXeR9KYEGz3Myje3xiCErQJi59P6LEgT');
      hdPath.derive('/1230141/1230141/1230141').toBase58().should
      .equal('xpub6Cgenu1h7Dv5CvhajBWtVXzJREAJyoQPM5BLuzgcrRmNCc4gLYdhuM4fggrkkLH3m2GoiCnqD3sP8W5UuFxVH6oLDMYckJszyjQNhkVjkYe');
    });
  });

  describe('Compatibility', function(){
    it('should not overwrite bitcoinjs-lib methods', function(){
      const hdNode = bitcoin.HDNode.fromBase58('xpub661MyMwAqRbcFfMYQX9xJftaf9oLChq7unXqHAN2CKYs7CTJo4XUohysxtFJEtcQkbmNSJHpEEJakPSQyYAC6YU6J1ReQTQDKtBoDX3uWvV');
      const provaNode = prova.HDNode.fromBase58('xpub661MyMwAqRbcFfMYQX9xJftaf9oLChq7unXqHAN2CKYs7CTJo4XUohysxtFJEtcQkbmNSJHpEEJakPSQyYAC6YU6J1ReQTQDKtBoDX3uWvV');
      hdNode.keyPair.network.should.equal(bitcoin.networks.bitcoin);
      provaNode.keyPair.network.should.not.equal(bitcoin.networks.bitcoin);
    });
  });

  describe('Network Consistency', function() {
    it('should preserve network through derivations', function() {
      const prv = 'xprv9s21ZrQH143K2KNCT5MHvotjrf4gSjv7zL5KXPvxaZwshFZn3cptpyWJGmajrY9pH9Rix41msRQCUzUeBATAg1u4LscmXi8gg7KNRDCAnFz';
      const keychain = prova.HDNode.fromBase58(prv, prova.networks.rmgTest);
      const hdPath = keychain.hdPath();
      const path = 'm/0/0/0/0';
      const derivedKey = hdPath.deriveKey(path);
      derivedKey.network.should.equal(keychain.keyPair.network);
    });

    it('should disallow incompatible networks through derivations', function() {
      const prv = 'xprv9s21ZrQH143K2KNCT5MHvotjrf4gSjv7zL5KXPvxaZwshFZn3cptpyWJGmajrY9pH9Rix41msRQCUzUeBATAg1u4LscmXi8gg7KNRDCAnFz';
      should.throws(() => {
        const keychain = prova.HDNode.fromBase58(prv, bitcoin.networks.litecoin);
      });
    });

    it('should obtain xpub from xprv', function() {
      const prv = 'xprv9s21ZrQH143K2KNCT5MHvotjrf4gSjv7zL5KXPvxaZwshFZn3cptpyWJGmajrY9pH9Rix41msRQCUzUeBATAg1u4LscmXi8gg7KNRDCAnFz';
      const keychain = prova.HDNode.fromBase58(prv, prova.networks.rmgTest);
      const xpub = keychain.neutered().toBase58();
      xpub.should.equal('xpub661MyMwAqRbcEoSfZ6tJHwqUQguArCdyMYzvKnLa8uUra3tvbA99Nmpn83s9dwotjLpZNUtRWviRAE4bFfyTbirRESCCPUrmfz9y8JsBCuc');
    });

    it('should obtain xpub from potentially non-zero-padded xprv', function() {
      const prv = 'xprv9s21ZrQH143K2wzTkqpwwJguJVpxDqq78RCRmq8aVtmPVLd1BZTx2jqEDdu5Xnd9532qefTXYeZFoJN3zBDn7ipkHtL9accNqQP1Nrwgndn';
      const keychain = prova.HDNode.fromBase58(prv, prova.networks.rmgTest);
      const xpub = keychain.neutered().toBase58();
      xpub.should.equal('xpub661MyMwAqRbcFS4vrsMxJSddrXfSdJYxVe82aDYC4EJNN8x9j6nCaY9i4xGyLkV97gE9TKF1Mv6sDMmWGXvN8tTu3pPDCoCGCwqTXUeSHJm');
    });

    it('should be able to generate both xpub and xprv', function() {
      const keychain = prova.HDNode.fromSeedBuffer(new Buffer('somesuperrandomseedbuffer'));
      const xprv = keychain.toBase58();
      const xpub = keychain.neutered().toBase58();
      xprv.should.equal('xprv9s21ZrQH143K4Q5mPy3J4ndj6gSJCXKKXXoJE5QgyZLi671MxUPxPZvDPBNtywCsM5dy2kHujUanxc44k8mxzSgi9daf7WWTiTUULxL7wuW');
      xpub.should.equal('xpub661MyMwAqRbcGtAEVzaJRvaTeiGnbz3Atkiu2TpJXtsgxuLWW1iCwNEhEVUqvbafwfDrcod6zP2ToEg9r9vSw4FuNQqLDLvXPnLs1o1cGGn');
    });

    it('should be able to generate both xpub and xprv on LTC', function() {
      const keychain = prova.HDNode.fromSeedBuffer(new Buffer('somesuperrandomseedbuffer'), bitcoin.networks.litecoin);
      const provaKeychain = prova.HDNode.fromSeedBuffer(new Buffer('somesuperrandomseedbuffer'), prova.networks.rmgTest);

      const derivationPath = '/1230141/4096/1230141';
      const derivation = keychain.hdPath().derive(derivationPath);
      const provaDerivation = provaKeychain.hdPath().derive(derivationPath);

      const keyPair = derivation.getKey();
      const provaKeyPair = provaDerivation.getKey();

      keyPair.network.should.equal(bitcoin.networks.litecoin);
      provaKeyPair.network.should.equal(prova.networks.rmgTest);

      const litecoinTestKeyPair = provaDerivation.getKey(prova.networks.litecoinTest);
      litecoinTestKeyPair.network.should.equal(prova.networks.litecoinTest);

      // compare the binaries
      const publicKey = keyPair.getPublicKeyBuffer().toString('hex');
      const provaPublicKey = provaKeyPair.getPublicKeyBuffer().toString('hex');
      publicKey.should.equal(provaPublicKey);

      const privateKey = keyPair.getPrivateKeyBuffer().toString('hex');
      const provaPrivateKey = provaKeyPair.getPrivateKeyBuffer().toString('hex');
      provaPrivateKey.should.equal(privateKey);

      const xprv = derivation.toBase58();
      const xpub = derivation.neutered().toBase58();
      xprv.should.equal('Ltpv776cBys668WTFi7NkTeXQC5PghvB64jeFCpbyieNywNyNexMKCgUt42sFvv5Jy9BvL1U4iuSBQYMLiAEJnJ3grFGjqyx7Ss4M8dHSr368s7');
      xpub.should.equal('Ltub2YGwnmHdLH3QsapD158uUmuc8GcNAKJJKivdehQfv8AZy29Re7iutf98WHVWzVuwm2PQp1bpAvWFdKaNZdGSUk8a5dwZppB9cWd6F17DsAF');

      const provaXprv = provaDerivation.toBase58();
      const provaXpub = provaDerivation.neutered().toBase58();
      provaXprv.should.equal('xprv9xrUvcYhcUB7QjToJZbuFmreVSTK154JqDo42EFwzHntMrBUSZuvXDLDJAP4SFW11DSBzDFv2KqhMD39ufK53jsvnH2moVp2Yk1PPTYYZiS');
      provaXpub.should.equal('xpub6BqqL85bSqjQdDYGQb8ucuoP3UHoQXnACSiepcfZYdKsEeWcz7EB51eh9QyVL6WhAoyqDtDGKtrsXEDFejAzdpM9nW47A8R781rkLY36VXc');
    });

    it('should allow initialization of HDNodes across network objects', function() {
      const prv = 'Ltpv776cBys668WTFi7NkTeXQC5PghvB64jeFCpbyieNywNyNexMKCgUt42sFvv5Jy9BvL1U4iuSBQYMLiAEJnJ3grFGjqyx7Ss4M8dHSr368s7';
      const keychain = prova.HDNode.fromBase58(prv);
      keychain.getKey().network.should.equal(bitcoin.networks.litecoin);
    });
  });
});
