<template>
  <div class="page-container">
    <div class="page-heading">
      FAQs
    </div>

    <div class="faq-container">
      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Where are you based? Where do you ship from?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              We're based in Concord, CA, just 30 minutes east of San Francisco. All BlendJet orders ship directly from our headquarters in sunny California.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How long will it take for my order to arrive?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              <p>We ship all orders placed Monday - Friday before 3:30PM PST / 6:30PM EST the same day. For customers within the United States, your order should arrive within 2 business days via USPS Priority Mail. If you do not receive your order within 3 days, please check your mailbox and tracking number, then contact us and we will make sure to get you blending in no time!</p>
              <p>We ship international orders via DHL and FedEx. Average delivery time is 6-9 business days, but could take longer depending on your country's customs process. This is outside of the control of BlendJet and the shipping carrier. With DHL, once your order arrives in your country, it is transferred to your local postal carrier for final delivery, and DHL tracking may stop updating. If it's been more than 5 weeks, contact us and we will help track down your order. Please note that certain countries may apply tariffs after the package is accepted. We recommend checking with your local post office to find out if that applies to you as BlendJet does not cover customs fees, import duties, taxes or other charges.</p>
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Which days do you ship?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              We ship orders placed before 3:30PM PST / 6:30PM EST the same day Monday – Friday excluding postal holidays.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How do I check the status of my order?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Upon order completion, you will receive an email and/or text message confirming your order. You will also receive a shipment confirmation and tracking number via email and/or text message once your package has been prepared for shipment. If you have questions about your order status or did not receive the email, please contact us.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">What if I entered the wrong shipping address?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              If you entered the wrong information for your order, please contact us as soon as possible. We'll do our best to change it for you, but we can't guarantee anything in this case as our orders are processed and shipped very quickly after purchase.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Can I ship to a PO Box or APO/FPO address?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Yes. Typically, customers put APO in the City field and AE or AP in the State field. You may also ship to a PO Box.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Can I fly with my Blendjet?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Yes! We recommend that you bring your BlendJet in your checked bag without any liquid inside. Many folks, even flight attendants and pilots, bring BlendJet in their carry-on regularly, but in some rare cases the TSA may not allow it.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How do I properly store my BlendJet blender?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Your BlendJet can be stored in a cupboard, as you would any other cup or protein shaker. We recommend keeping the lid loose rather than tightly closed, to allow any excess water to evaporate.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How do I clean my BlendJet blender?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              We recommend blending water with a drop of soap to clean your BlendJet. Rinse with plain water, and you're ready for your next blended creation.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How many ounces does my BlendJet hold?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              The BlendJet 2 holds 16 oz (475 mL) and BlendJet One holds 12 oz (355 mL).
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">How much does my BlendJet weigh?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Your BlendJet weighs just over 1 lb, so it's light enough to toss in your bag and go!
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Do you offer replacement parts?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              If your BlendJet is out of warranty or you've had some accidental damage and need to replace a broken part, you can order replacement parts at a very low cost. We want to keep our customers happy and healthy!
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Do you offer extended warranties and accidental damage protection?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              When you buy your BlendJet on http://BlendJet.com, you have the option to add a 1 - 3 year warranty for an extra $3.99, $6.99, or $10.99. Extend, a leader in the extended warranty business, provides this amazing service and value that guarantees you’ll be blending on the go for years to come, even if you accidentally drop your BlendJet from atop Mount Everest.
            </div>
          </template>
        </Collapse>
      </div>

      <div class="faq-section">
        <Collapse>
          <template v-slot:collapsed>
            <div class="c-heading">Did you invent the portable blender?</div>
          </template>
          <template v-slot:expanded>
            <div class="faq-expand">
              Yes, we have 4 granted patents on our game-changing technology. We designed the original portable blender in California and worked hard to turn our concept into reality.
            </div>
          </template>
        </Collapse>
      </div>

    </div>
  </div>
</template>

<script>
import Collapse from '~/components/collapse'
export default {

  components: {
    Collapse
  }

}
</script>

<style lang="scss" scoped>

  .page-container {
    @include gradient-primary-purple-turquoise(to bottom);
    width: 100vw;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    padding-bottom: 50px;
  }

  .page-heading {
    font-family: Medium;
    font-size: 38px;
    // color: $primary-purple;
    color: $grayscale-white;
    line-height: 1.29;
    letter-spacing: 6px;

    margin-top: 60px;
    margin-bottom: 60px;

    @include respond-to('small') {
      font-size: 28px;
      letter-spacing: 3.5px;
      margin-top: 35px;
      margin-bottom: 35px;
    }
  }

  .c-heading {
    font-family: Bold;
    font-size: 18px;
    line-height: 1.33;
    letter-spacing: 3.5px;
    color: $primary-purple;
    text-transform: uppercase;
    margin-right: 35px;
    // width: 810px;

    @include respond-to('small') {
      font-size: $text-small;
      line-height: 1.5;
      letter-spacing: 1.75px;
    }
  }

  // .expand-panel {
  //   width: 810px
  // }

  .faq-container {
    width: 900px;

    @include respond-to('small') {
      width: 90vw
    }
  }

  .faq-expand {
    font-family: Regular;
    font-size: 14px;
    letter-spacing: 0.5px;
    line-height: 1.21;
    color: $primary-purple;

    & p {
      margin-bottom: 15px;
    }
  }

  .faq-section {
    margin-bottom: 35px;

    @include respond-to('small') {
      margin-bottom: 20px;
    }
  }
</style>
