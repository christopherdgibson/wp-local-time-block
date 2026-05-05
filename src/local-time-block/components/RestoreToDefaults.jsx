  import {Button, Modal} from "@wordpress/components";

  export default function restoreToDefaults(isModalOpenDefaultCard, setIsModalOpenDefaultCard, setAttributes) {
    return (
      <div style={{ marginTop: "1em", textAlign: "center" }}>
        <Button
          variant="primary"
          onClickCapture={() => setIsModalOpenDefaultCard(true)}
        >
          Restore to defaults
        </Button>
        {isModalOpenDefaultCard && (
          <Modal
            title="Restore Defaults"
            onRequestClose={() => setIsModalOpenDefaultCard(false)}
          >
            <p>Are you sure you want to restore the default colors?</p>
            <Button
              variant="primary"
              onClick={() => {
                setAttributes({
                  dividerColorLeft: DEFAULT_LEFT_COLOR,
                  dividerColorRight: DEFAULT_RIGHT_COLOR,
                  cardBgColor: DEFAULT_BG_COLOR,
                  cardFontColor: DEFAULT_FONT_COLOR,
                });
                setIsModalOpenDefaultCard(false);
              }}
            >
              Yes, restore.
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpenDefaultCard(false)}
              style={{ marginLeft: "1em" }}
            >
              Cancel
            </Button>
          </Modal>
        )}
      </div>
    );
  }